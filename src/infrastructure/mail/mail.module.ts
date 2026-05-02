import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { mailerFactory } from '@/config'

import { MailService } from './mail.service'
import { TemplateService } from './template.service'

@Module({
	providers: [MailService, TemplateService],
	imports: [
		MailerModule.forRootAsync({
			useFactory: mailerFactory,
			inject: [ConfigService]
		})
	],
	exports: [MailService]
})
export class MailModule {}
