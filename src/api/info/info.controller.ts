import { Controller, Get } from '@nestjs/common';
import { InfoService } from './info.service';
import { GetInfoResponseDTO } from '../../dtos/info.dto';

@Controller('api/info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get()
  public getInfo(): Promise<GetInfoResponseDTO> {
    return this.infoService.getInfo();
  }
}
