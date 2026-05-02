import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { MailModule } from '@/infrastructure/mail/mail.module'
import { RabbitmqModule } from '@/infrastructure/rabbitmq/rabbitmq.module'
import { NotificationModule } from '@/modules/notification/notification.module'

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
		RabbitmqModule,
		MailModule,
		NotificationModule
	]
})
export class AppModule {}
