import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as open from 'open';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GoogleService {
  private readonly CREDENTIALS_PATH = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'secret',
    'credentials.json',
  );

  private readonly TOKEN_PATH = path.resolve(
    __dirname,
    '../../../',
    'assets',
    'secret',
    'token.json',
  );

  private readonly SCOPES: string[] = ['https://www.googleapis.com/auth/drive'];

  private readonly authUrlConfig = {
    access_type: 'offline',
    scope: this.SCOPES,
    include_granted_scopes: true,
  };

  public async getCredentials() {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(
          this.CREDENTIALS_PATH,
          { flag: 'r+', encoding: 'utf8' },
          (error, buffer: Buffer) => {
            if (error) return reject(error);
            const content = buffer.toString();
            const keys = JSON.parse(content);
            const key = keys.installed || keys.web;
            return resolve(key);
          },
        );
      } catch (error) {
        return reject(error);
      }
    });
  }
  public loadOAuth2Client(): Promise<OAuth2Client | null> {
    return new Promise<OAuth2Client | null>(async (resolve, reject) => {
      try {
        if (!fs.existsSync(this.TOKEN_PATH)) {
          return reject(null);
        }

        const cred: any = await this.getCredentials();

        fs.readFile(
          this.TOKEN_PATH,
          { flag: 'r+', encoding: 'utf-8' },
          (error, buffer: Buffer) => {
            if (error) return reject(error);
            const content = buffer.toString();
            const keys = JSON.parse(content);
            const client: OAuth2Client = new google.auth.OAuth2({
              clientId: cred.client_id,
              clientSecret: cred.client_secret,
              redirectUri: cred.redirect_uris[0],
              credentials: keys,
            });
            return resolve(client);
          },
        );
      } catch (error) {
        console.error(error);
        return reject(null);
      }
    });
  }

  public async generateOAuth2Client(): Promise<OAuth2Client> {
    // return authenticate({
    //   scopes: this.SCOPES,
    //   keyfilePath: this.CREDENTIALS_PATH,
    // });

    const oAuth2Client = await this.emptyOAuth2Client;
    const authUrl = oAuth2Client.generateAuthUrl(this.authUrlConfig);
    open(authUrl);
    return oAuth2Client;
  }

  public handleCallback(code: string): Promise<OAuth2Client> {
    return new Promise<OAuth2Client>(async (resolve, reject) => {
      try {
        const oauth2client = await this.emptyOAuth2Client;

        const { tokens } = await oauth2client.getToken(code).catch(() => null);
        console.log('tokens: ', tokens);
        oauth2client.setCredentials(tokens);
        console.log('Authentication successful!');
        return resolve(oauth2client);
      } catch (error) {
        return reject(error);
      }
    });
  }

  public async saveCredentials(client: OAuth2Client): Promise<void> {
    client.refreshAccessToken((error, tokens) => {
      if (error) {
        return console.error(error);
      }
      console.log(tokens);
    });

    const payload = JSON.stringify(client.credentials);

    fs.writeFile(this.TOKEN_PATH, payload, () => {
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
}
