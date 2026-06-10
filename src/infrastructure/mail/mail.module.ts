import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { mailerFactory } from '@/config'

import { MailService } from './mail.service'
import { OtpImageService } from './otp-image.service'
import { TemplateService } from './template.service'

@Module({
	providers: [MailService, TemplateService, OtpImageService],
	imports: [
		MailerModule.forRootAsync({
			useFactory: mailerFactory,
			inject: [ConfigService]
		})
	],
	exports: [MailService]
})
export class MailModule {}
