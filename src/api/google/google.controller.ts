import { Controller, Get, Query, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { rolesEnum } from '../../interfaces/roles.interface';
import { Roles } from '../../decorators/roles.decorator';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { Response } from 'express';

@Controller('/api/google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  @Get()
  public async googleAuth() {
    return this.googleService.googleAuth();
  }

  @Get('/callback')
  public async handleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    this.googleService.handleCallback(code);
    return res.redirect('/');
  }

  @Get('/token/expiry')
  @Roles(rolesEnum.admin)
  public async getAuthTokenExpiryDate() {
    return this.googleService.getTokenExpiry();
  }

  @Get('/token/update')
  @Roles(rolesEnum.admin)
  public async updateAuthTokens() {
    return this.googleService.updateToken();
  }
}
