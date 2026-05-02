import type { OtpRequestedEvent } from '@ciganov/contracts'
import { Controller } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { RabbitmqService } from '@/infrastructure/rabbitmq/rabbitmq.service'

import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
	constructor(
		private readonly notificationService: NotificationService,
		private readonly rabbitmqService: RabbitmqService
	) {}

	@EventPattern('auth.otp.requested')
	public async otpRequested(
		@Payload() data: OtpRequestedEvent,
		@Ctx() ctx: RmqContext
	) {
		try {
			await this.notificationService.sendOtp(data)
			await this.rabbitmqService.ack(ctx)
		} catch (error) {
			this.rabbitmqService.nack(ctx)
		}
	}
}
