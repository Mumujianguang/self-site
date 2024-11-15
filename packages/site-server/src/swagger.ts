import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * setup swagger
 * @param app 
 */
export default function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('API of Mmjg site')
        .setDescription('provides API about personal notes, sport data, etc.')
        .setVersion('1.0.0')
        .addTag('MMJG')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
}