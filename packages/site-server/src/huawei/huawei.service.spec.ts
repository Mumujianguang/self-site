import { Test, TestingModule } from '@nestjs/testing';
import { HuaweiService } from './huawei.service';

describe('HuaweiService', () => {
  let service: HuaweiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuaweiService],
    }).compile();

    service = module.get<HuaweiService>(HuaweiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
