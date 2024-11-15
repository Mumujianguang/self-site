import { NestFactory } from '@nestjs/core';
import './env'
import setupSwagger from './swagger';

async function bootstrap() {
    const { AppModule } = await import('./app.module');

    const app = await NestFactory.create(AppModule);

    setupSwagger(app)

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
