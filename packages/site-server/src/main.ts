import { NestFactory } from '@nestjs/core';
import './env'
import setupSwagger from './swagger';
import setupHuaweiSDK from './sdk/huawei';

async function bootstrap() {
    const { AppModule } = await import('./app.module');

    const app = await NestFactory.create(AppModule);

    setupSwagger(app)
    setupHuaweiSDK()

    await app.listen(process.env.PORT ?? 9999);
}

bootstrap();
