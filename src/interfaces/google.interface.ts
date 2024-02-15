import { OAuth2Client } from 'google-auth-library';

export interface IGetAuthTokenExpiryDateResponse {
  error?: string;
  date?: number;
  pretty?: Date;
  time?: string;
}

export interface IUpdateAccessTokenResponse {
  client: OAuth2Client;
  message: string;
}
