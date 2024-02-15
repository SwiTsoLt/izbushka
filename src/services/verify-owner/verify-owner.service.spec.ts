import { Test, TestingModule } from '@nestjs/testing';
import { VerifyOwnerService } from './verify-owner.service';

describe('VerifyOwnerService', () => {
  let service: VerifyOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyOwnerService],
    }).compile();

    service = module.get<VerifyOwnerService>(VerifyOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
