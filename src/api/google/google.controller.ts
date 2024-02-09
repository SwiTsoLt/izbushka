import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Auth } from '../../decorators/auth/auth.decorator';
import { rolesEnum } from '../../interfaces/roles.interface';

export let oAuth2Client = null;

@Controller('/api/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @Auth(rolesEnum.admin)
  public async googleAuth() {
    const client = await this.googleService
      .loadOAuth2Client()
      .catch(() => null);

    if (client?.credentials) {
      oAuth2Client = client;
      return 'Success load oauth client';
    }

    await this.googleService.generateOAuth2Client().catch((error) => {
      console.error(error);
      return null;
    });
  }

  @Get('/callback')
  public async handleCallback(@Query('code') code: string): Promise<void> {
    oAuth2Client = await this.googleService
      .handleCallback(code)
      .catch((error) => {
        console.error(error);
        return null;
      });
    await this.googleService.saveCredentials(oAuth2Client).catch((error) => {
      console.error(error);
      return null;
    });
  }
}
