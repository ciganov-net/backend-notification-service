import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function mailerFactory(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('SMTP_HOST'),
			port: configService.getOrThrow<number>('SMTP_PORT'),
			auth: {
				user: configService.getOrThrow<string>('SMTP_USERNAME'),
				pass: configService.getOrThrow<string>('SMTP_PASSWORD')
			},
			secure: true,
			name: 'ciganov.net'
		},
		defaults: {
			from: configService.getOrThrow<string>('SMTP_FROM_ADDRESS')
		}
	}
}
