import { Injectable } from '@nestjs/common';
import { Credentials, type OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';
import {
  IGetTokenExpiryResponse,
  IUpdateTokenResponse,
  IClient,
} from '../../interfaces/google.interface';

@Injectable()
export class GoogleService {
  private oAuth2Client: OAuth2Client;

  private readonly CREDENTIALS_PATH_DEV = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'secret',
    'credentials.json',
  );

  private readonly CREDENTIALS_PATH_PROD = '/etc/secrets/credentials.json';

  private readonly ASSETS_PATH = path.resolve(__dirname, '../../../', 'assets');

  private readonly TOKEN_PATH = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'token.json',
  );

  private readonly TOKEN_PATH_SECRET_DEV = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'secret',
    'token.json',
  );

  private readonly TOKEN_PATH_SECRET = path.resolve(
    '/etc',
    'secrets',
    'token.json',
  );

  private readonly SCOPES: string[] = ['https://www.googleapis.com/auth/drive'];

  private readonly AUTH_URL_CONFIG = {
    access_type: 'offline',
    scope: this.SCOPES,
    include_granted_scopes: true,
  };

  constructor() {
    this.oAuth2Client = this.getClient();
    if (!this.oAuth2Client) {
      this.oAuth2Client = this.getClient(false);
    }
  }

  public getOAuth2Client(): OAuth2Client {
    return this.oAuth2Client;
  }

  public googleAuth() {
    let client = this.getClient();
    if (client) return;
    client = this.getClient(false);
    const authUrl = client.generateAuthUrl(this.AUTH_URL_CONFIG);
    open(authUrl);
  }

  public async handleCallback(code: string): Promise<void> {
    try {
      const { tokens } = await this.oAuth2Client
        .getToken(code)
        .catch((error) => {
          console.error(error);
          return error;
        });
      if (!tokens) return;
      this.saveToken(tokens);
    } catch (error) {
      console.error(error);
    }
  }

  public getTokenExpiry(): IGetTokenExpiryResponse {
    const token = this.getToken(false);
    const delta = token.expiry_date - Date.now();

    if (delta < 0) {
      return { error: 'Token expire' };
    }

    const hours = Math.floor(delta / 1000 / 60 / 60);
    const minutes = Math.floor((delta - hours * 60 * 60 * 1000) / 1000 / 60);
    const seconds = Math.floor((delta - minutes * 60 * 1000) / 1000);

    return {
      date: token.expiry_date,
      pretty: new Date(token.expiry_date),
      time: `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`,
    };
  }

  public updateToken(): Promise<IUpdateTokenResponse> {
    return new Promise((res) => {
      if (!this.oAuth2Client) return res({ message: 'OAuth2Client not found' });

      this.oAuth2Client.refreshAccessToken((err, tokens) => {
        if (err) {
          console.error(err);
          return res({ message: err.message });
        }

        this.saveToken(tokens);
        return res({
          message: 'Token has been updated successfully!',
        });
      });
    });
  }

  // Private

  private getClient(checkToken: boolean = true): OAuth2Client {
    const cred = this.getCredentials();
    const token = checkToken ? this.getToken() : this.getToken(false);

    if (!cred) return undefined;
    if (checkToken && !token) return undefined;

    const redirectUri = this.isProd()
      ? cred.redirect_uris[0]
      : cred.redirect_uris[1];

    const client = new google.auth.OAuth2({
      clientId: cred.client_id,
      clientSecret: cred.client_secret,
      redirectUri,

      credentials: token,
    });

    return client;
  }

  private saveToken(token: Credentials): void {
    this.oAuth2Client.setCredentials(token);

    const oldToken = this.getToken(false);

    if (!fs.existsSync(this.ASSETS_PATH)) {
      fs.mkdirSync(this.ASSETS_PATH);
    }

    const newToken = token.refresh_token.length
      ? token
      : { ...token, refresh_token: oldToken.refresh_token };

    fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(newToken));
  }

  private getToken(hasValidation: boolean = true): Credentials | undefined {
    const tokenPath = this.getTokenPath();
    if (!tokenPath) return undefined;
    const content = fs.readFileSync(tokenPath);

    try {
      const token = JSON.parse(content.toString());
      if (!hasValidation) return token;
      return this.isTokenValid(token) ? token : undefined;
    } catch (_) {
      return undefined;
    }
  }

  private getCredentials(): IClient | undefined {
    try {
      const credentialsPath = this.getCredentialsPath();
      const content = fs.readFileSync(credentialsPath);
      const keys = JSON.parse(content.toString());
      const cred = keys.web;
      return cred;
    } catch (_) {
      return undefined;
    }
  }

  private getCredentialsPath(): string {
    return this.isProd()
      ? this.CREDENTIALS_PATH_PROD
      : this.CREDENTIALS_PATH_DEV;
  }

  private getTokenPath(): string | undefined {
    if (fs.existsSync(this.TOKEN_PATH)) return this.TOKEN_PATH;
    if (fs.existsSync(this.TOKEN_PATH_SECRET)) return this.TOKEN_PATH_SECRET;
    if (fs.existsSync(this.TOKEN_PATH_SECRET_DEV))
      return this.TOKEN_PATH_SECRET_DEV;
    return undefined;
  }

  private isTokenValid(token: Credentials): boolean {
    const delta = token.expiry_date - Date.now();
    return delta > 0 && !!token?.refresh_token?.length;
  }

  private isProd(): boolean {
    return fs.existsSync(this.CREDENTIALS_PATH_PROD);
  }
}
