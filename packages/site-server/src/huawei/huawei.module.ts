import { Module } from '@nestjs/common';
import { HuaweiController } from './huawei.controller';
import { HuaweiService } from './huawei.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [HuaweiController],
  providers: [HuaweiService]
})
export class HuaweiModule {}
