import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './core/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: [config.getOrThrow<string>('RMQ_URL')],
			queue: config.getOrThrow<string>('RMQ_QUEUE'),
			queueOptions: {
				durable: true
			},
			noAck: false,
			prefetchCount: 10,
			persistent: true
		}
	})

	await app.startAllMicroservices()
	await app.listen(config.getOrThrow<number>('HTTP_PORT'))
}
bootstrap()
