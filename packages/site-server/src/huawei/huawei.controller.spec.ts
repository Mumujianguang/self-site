import { Test, TestingModule } from '@nestjs/testing';
import { HuaweiController } from './huawei.controller';

describe('HuaweiController', () => {
  let controller: HuaweiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HuaweiController],
    }).compile();

    controller = module.get<HuaweiController>(HuaweiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
