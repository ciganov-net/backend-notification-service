import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

@Injectable()
export class OtpImageService {
	public async generate(code: string): Promise<Buffer> {
		if (!/^\d{6}$/.test(code)) {
			throw new Error('OTP code must contain exactly 6 digits')
		}

		const assetsDir = path.join(__dirname, 'assets', 'otp')
		const baseImagePath = path.join(assetsDir, 'codeBase.png')

		if (!fs.existsSync(baseImagePath)) {
			throw new Error(`Base image not found: ${baseImagePath}`)
		}

		const overlays: sharp.OverlayOptions[] = []

		for (let index = 0; index < code.length; index++) {
			const position = index + 1
			const digit = code[index]

			const overlayPath = path.join(
				assetsDir,
				`teeth${position}_code${digit}.png`
			)

			if (!fs.existsSync(overlayPath)) {
				throw new Error(`OTP overlay not found: ${overlayPath}`)
			}

			overlays.push({
				input: overlayPath,
				left: 0,
				top: 0
			})
		}

		return sharp(baseImagePath)
			.composite(overlays)
			.png()
			.toBuffer()
	}
}