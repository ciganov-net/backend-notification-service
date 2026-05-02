import { OtpRequestedEvent } from '@ciganov/contracts'
import { Injectable } from '@nestjs/common'

import { MailService } from '@/infrastructure/mail/mail.service'

@Injectable()
export class NotificationService {
	constructor(private readonly mailService: MailService) {}

	public async sendOtp(data: OtpRequestedEvent) {
		const { identifier, code } = data
		await this.mailService.sendOtp(identifier, code)
	}
}
