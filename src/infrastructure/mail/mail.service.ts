import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

import { OtpImageService } from './otp-image.service'
import { TemplateService } from './template.service'

@Injectable()
export class MailService {
	public constructor(
		private readonly transporter: MailerService,
		private readonly templateService: TemplateService,
		private readonly otpImageService: OtpImageService
	) {}

	public async sendOtp(email: string, code: string) {
		const imageBuffer = await this.otpImageService.generate(code)
		const html = await this.templateService.render('otp', { code, digits: code.split(''), codeImageSrc: 'cid:otp-code-image' })
		await this.transporter.sendMail({
			to: email,
			subject: 'Деп вашей квартиры начинается с нас',
			html,
			attachments: [
				{
					filename: 'otp-code.png',
					content: imageBuffer,
					cid: 'otp-code-image',
					contentType: 'image/png'
				}
			]
		})
		return true
	}

	public async sendEmailChange(email: string, code: string) {
		const html = await this.templateService.render('email-changed', { code })
		await this.transporter.sendMail({
			to: email,
			subject: 'Код для смены почты',
			html
		})
	}
}
