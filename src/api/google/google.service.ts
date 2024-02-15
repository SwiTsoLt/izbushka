import { Injectable } from '@nestjs/common';
import { type OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GoogleService {
  private readonly CREDENTIALS_PATH_DEV = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'secret',
    'credentials.json',
  );

  private readonly CREDENTIALS_PATH_PROD = '/etc/secrets/credentials.json';

  private readonly TOKEN_PATH_DEV = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'token.json',
  );

  // private readonly TOKEN_PATH_PROD = '/etc/secrets/token.json';

  private readonly SCOPES: string[] = ['https://www.googleapis.com/auth/drive'];

  private readonly authUrlConfig = {
    access_type: 'offline',
    scope: this.SCOPES,
    include_granted_scopes: true,
  };

  public loadOAuth2Client(
    checkAccessTokenExpiry: boolean = true,
  ): OAuth2Client | null {
    const credentials = this.credentials;
    if (!credentials) return null;

    const token = this.token;
    if (checkAccessTokenExpiry && (!token || token.expiry_date < Date.now()))
      return null;

    const redirectUri =
      this.credentialsPath === this.CREDENTIALS_PATH_PROD
        ? credentials.redirect_uris[0]
        : credentials.redirect_uris[1];

    const client: OAuth2Client = new google.auth.OAuth2({
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret,
      redirectUri,
      credentials: token,
    });

    return client;
  }

  public generateOAuth2Client(): OAuth2Client {
    const oAuth2Client = this.emptyOAuth2Client;
    const authUrl = oAuth2Client.generateAuthUrl(this.authUrlConfig);
    open(authUrl);
    return oAuth2Client;
  }

  public async handleCallback(code: string): Promise<OAuth2Client> {
    return await new Promise<OAuth2Client>(async (resolve, reject) => {
      try {
        const oauth2client = this.emptyOAuth2Client;

        const { tokens } = await oauth2client.getToken(code).catch(() => null);

        if (!tokens.refresh_token) {
          const content = fs.readFileSync(this.tokenPath, 'utf-8');
          const token = JSON.parse(content);
          const credentials = {
            ...tokens,
            refresh_token: token.refresh_token,
          };
          oauth2client.setCredentials(credentials);
          console.log('Authentication successful!');
          return resolve(oauth2client);
        }

        oauth2client.setCredentials(tokens);
        console.log('Authentication successful!');
        resolve(oauth2client);
      } catch (error) {
        reject(error);
      }
    });
  }

  public getAuthTokenExpiryDate() {
    if (!this.tokenPath) return null;
    const content = fs.readFileSync(this.tokenPath, 'utf-8');
    const token = JSON.parse(content);
    const d = token.expiry_date - Date.now();
    if (d < 0) {
      return 'token expire';
    }

    const hours = Math.floor(d / 1000 / 60 / 60);
    const minutes = Math.floor(d / 1000 / 60);
    const seconds = Math.floor(d / 1000 - minutes * 60);
    return {
      date: token.expiry_date,
      pretty: new Date(token.expiry_date),
      time: `${hours}h ${minutes}m ${seconds}s`,
    };
  }

  public updateAuthTokens() {
    return new Promise((resolve, reject) => {
      const client = this.loadOAuth2Client(false);
      if (!client) return null;

      client.refreshAccessToken((error, tokens) => {
        if (error) return reject(error);

        const payload = {
          ...this.token,
          ...tokens,
        };

        fs.writeFile(this.tokenPath, JSON.stringify(payload), () => {
          console.log('Credential has been successful saved!');
        });

        client.setCredentials(tokens);
        return resolve(client);
      });
    });
  }

  public saveAccessTokens(client: OAuth2Client): void {
    const payload = JSON.stringify(client.credentials);
    fs.writeFile(this.tokenPath, payload, () => {
      console.log('Credential has been successful saved!');
    });
  }

  // Drive

  public getDrive(auth: OAuth2Client) {
    return google.drive({ version: 'v3', auth });
  }

  // Private

  private get emptyOAuth2Client(): OAuth2Client {
    const credentials = this.credentials;

    return new google.auth.OAuth2({
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret,
      redirectUri: credentials.redirect_uris[0],
    });
  }

  private get credentials() {
    const filePath = this.credentialsPath;
    if (!filePath) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    const keys = JSON.parse(content);
    return keys.installed || keys.web;
  }

  private get token() {
    const filePath = this.tokenPath;
    if (!filePath) return null;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }

  private get credentialsPath() {
    if (fs.existsSync(this.CREDENTIALS_PATH_PROD))
      return this.CREDENTIALS_PATH_PROD;
    if (fs.existsSync(this.CREDENTIALS_PATH_DEV))
      return this.CREDENTIALS_PATH_DEV;
    return null;
  }

  private get tokenPath() {
    // if (fs.existsSync(this.CREDENTIALS_PATH_PROD)) return this.TOKEN_PATH_PROD;
    if (fs.existsSync(this.CREDENTIALS_PATH_DEV)) return this.TOKEN_PATH_DEV;
    return null;
  }
}
