import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { rolesEnum } from '../../interfaces/roles.interface';
import { Roles } from '../../decorators/roles.decorator';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { IUpdateAccessTokenResponse } from '../../interfaces/google.interface';

export let oAuth2Client = null;

@Controller('/api/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  @Roles(rolesEnum.admin)
  public googleAuth() {
    const client = this.googleService.loadOAuth2Client();
    if (!client) return null;

    if (client?.credentials) {
      oAuth2Client = client;
      return 'Success load oauth client';
    }

    this.googleService.generateOAuth2Client();
  }

  @Get('/callback')
  public async handleCallback(@Query('code') code: string): Promise<void> {
    oAuth2Client = await this.googleService
      .handleCallback(code)
      .catch((error) => {
        console.error(error);
        return null;
      });
    this.googleService.saveAccessTokens(oAuth2Client);
  }

  @Get('/token/expiry')
  @Roles(rolesEnum.admin)
  public async getAuthTokenExpiryDate() {
    return this.errorHandlerService.handleError(
      new Promise((res) => res(this.googleService.getAuthTokenExpiryDate())),
    );
  }

  @Get('/token/update')
  @Roles(rolesEnum.admin)
  public async updateAuthTokens() {
    const { client, message } =
      await this.errorHandlerService.handleError<IUpdateAccessTokenResponse>(
        this.googleService.updateAuthTokens(),
      );
    oAuth2Client = client;
    return { message };
  }
}
