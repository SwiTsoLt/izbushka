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
    'secret',
    'token.json',
  );

  private readonly TOKEN_PATH_PROD = '/etc/secrets/token.json';

  private readonly SCOPES: string[] = ['https://www.googleapis.com/auth/drive'];

  private readonly authUrlConfig = {
    access_type: 'offline',
    scope: this.SCOPES,
    include_granted_scopes: true,
  };

  public async getCredentials() {
    return await new Promise((resolve, reject) => {
      try {
        if (this.credentialsPath === null) return reject(null);

        fs.readFile(
          this.credentialsPath,
          { flag: 'r+', encoding: 'utf8' },
          (error, buffer: Buffer) => {
            if (error) {
              reject(error);
              return;
            }
            const content = buffer.toString();
            const keys = JSON.parse(content);
            const key = keys.installed || keys.web;
            resolve(key);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  public async loadOAuth2Client(): Promise<OAuth2Client | null> {
    return await new Promise<OAuth2Client | null>(async (resolve, reject) => {
      try {
        const cred: any = await this.getCredentials();

        if (this.tokenPath === null) return reject(null);

        fs.readFile(
          this.tokenPath,
          { flag: 'r+', encoding: 'utf-8' },
          (error, buffer: Buffer) => {
            if (error) {
              reject(error);
              return;
            }
            const content = buffer.toString();
            const keys = JSON.parse(content);
            const client: OAuth2Client = new google.auth.OAuth2({
              clientId: cred.client_id,
              clientSecret: cred.client_secret,
              redirectUri:
                this.credentialsPath === this.CREDENTIALS_PATH_PROD
                  ? cred.redirect_uris[0]
                  : cred.redirect_uris[1],
              credentials: keys,
            });
            resolve(client);
          },
        );
      } catch (error) {
        console.error(error);
        reject(null);
      }
    });
  }

  public async generateOAuth2Client(): Promise<OAuth2Client> {
    const oAuth2Client = await this.emptyOAuth2Client;
    const authUrl = oAuth2Client.generateAuthUrl(this.authUrlConfig);
    open(authUrl);
    return oAuth2Client;
  }

  public async handleCallback(code: string): Promise<OAuth2Client> {
    return await new Promise<OAuth2Client>(async (resolve, reject) => {
      try {
        const oauth2client = await this.emptyOAuth2Client;

        const { tokens } = await oauth2client.getToken(code).catch(() => null);
        console.log('tokens: ', tokens);
        oauth2client.setCredentials(tokens);
        console.log('Authentication successful!');
        resolve(oauth2client);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async saveCredentials(client: OAuth2Client): Promise<void> {
    client.refreshAccessToken((error, tokens) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(tokens);
    });

    const payload = JSON.stringify(client.credentials);

    fs.writeFile(this.tokenPath, payload, () => {
      console.log('Credential has been successful saved!');
    });
  }

  // Drive

  processList(files) {
    console.log('Processing....');
    files.forEach((file) => {
      // console.log(file.name + '|' + file.size + '|' + file.createdTime + '|' + file.modifiedTime);
      console.log(file);
    });
  }

  public getDrive(auth: OAuth2Client) {
    return google.drive({ version: 'v3', auth });
  }

  // Private

  private get emptyOAuth2Client(): Promise<OAuth2Client> {
    return this.getCredentials().then((keys: any) => {
      return new google.auth.OAuth2({
        clientId: keys.client_id,
        clientSecret: keys.client_secret,
        redirectUri: keys.redirect_uris[0],
      });
    });
  }

  private get credentialsPath() {
    if (fs.existsSync(this.CREDENTIALS_PATH_PROD))
      return this.CREDENTIALS_PATH_PROD;
    if (fs.existsSync(this.CREDENTIALS_PATH_DEV))
      return this.CREDENTIALS_PATH_DEV;
    return null;
  }

  private get tokenPath() {
    if (fs.existsSync(this.CREDENTIALS_PATH_PROD)) return this.TOKEN_PATH_PROD;
    if (fs.existsSync(this.CREDENTIALS_PATH_DEV)) return this.TOKEN_PATH_DEV;
    return null;
  }
}
