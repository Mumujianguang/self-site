import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { HuaweiModule } from './huawei/huawei.module';

@Module({
    imports: [NotesModule, HuaweiModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
