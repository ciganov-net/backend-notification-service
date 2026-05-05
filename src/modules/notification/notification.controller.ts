import type { OtpRequestedEvent } from '@ciganov/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import { PinoLogger } from 'nestjs-pino'
import { Counter, Histogram } from 'prom-client'

import { RabbitmqService } from '@/infrastructure/rabbitmq/rabbitmq.service'

import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
	private readonly SERVICE_NAME: string

	constructor(
		private readonly notificationService: NotificationService,
		private readonly rabbitmqService: RabbitmqService,
		@InjectMetric('rmq_event_processing_duration_seconds')
		private readonly processingDuration: Histogram<string>,
		@InjectMetric('rmq_event_total')
		private readonly eventTotal: Counter<string>,
		private readonly logger: PinoLogger
	) {
		this.SERVICE_NAME = 'notification'
		this.logger.setContext(NotificationController.name)
	}

	@EventPattern('auth.otp.requested')
	public async otpRequested(
		@Payload() data: OtpRequestedEvent,
		@Ctx() ctx: RmqContext
	) {
		const event = 'auth.otp.requested'
		const endTimer = this.processingDuration.startTimer({
			service: this.SERVICE_NAME,
			event
		})
		try {
			await this.notificationService.sendOtp(data)
			this.eventTotal.inc({
				service: this.SERVICE_NAME,
				event,
				status: 'success'
			})
			await this.rabbitmqService.ack(ctx)
		} catch (error) {
			//@ts-ignore
			this.logger.error(`OTP processing error: ${error?.message ?? error}`)
			this.eventTotal.inc({
				service: this.SERVICE_NAME,
				event,
				status: 'error'
			})
			this.rabbitmqService.nack(ctx)
			throw error
		} finally {
			endTimer()
		}
	}
}
