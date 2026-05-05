import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'

import { MailModule } from '@/infrastructure/mail/mail.module'
import { RabbitmqModule } from '@/infrastructure/rabbitmq/rabbitmq.module'
import { NotificationModule } from '@/modules/notification/notification.module'
import { ObservabilityModule } from '@/observability/observability.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				'.env'
			]
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				level: process.env.LOG_LEVEL,
				transport: {
					target: 'pino/file',
					options: {
						destination: '/var/log/services/notification/notification.log',
						mkdir: true
					}
				},
				messageKey: 'msg',
				customProps: () => ({
					service: 'notification-service'
				})
			}
		}),
		ObservabilityModule,
		RabbitmqModule,
		MailModule,
		NotificationModule
	]
})
export class AppModule {}
