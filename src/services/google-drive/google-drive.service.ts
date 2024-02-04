import { Injectable } from '@nestjs/common';
import { GoogleService } from '../../api/google/google.service';
import { drive_v3, google } from 'googleapis';
import { Readable } from 'stream';

export interface IUploadFileParams {
  buffer: Buffer;
  name: string;
  parents: string[];
}

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive | null = null;

  constructor(private readonly googleService: GoogleService) {
    this.googleService.loadOAuth2Client().then((auth) => {
      this.drive = google.drive({ version: 'v3', auth });
    });
  }

  public async uploadFile(params: IUploadFileParams) {
    const fileReadStream = Readable.from(params.buffer);

    const media = {
      mimeType: 'image/webp',
      body: fileReadStream,
    };

    const requestBody = {
      name: params.name,
      parents: params.parents,
    };

    const response = await this.drive.files
      .create({
        media,
        requestBody,
        fields: 'id',
      })
      .catch((error) => {
        console.error(error);
      });
    if (!response) return null;
    console.log(response.data);
    const link = this.generatePublicLink(response.data.id);
    if (!link) return null;
    return link;
  }

  private async generatePublicLink(id: string): Promise<string | null> {
    try {
      const response = await this.drive.files.get({
        fileId: id,
        fields: 'webContentLink',
      });
      return response.data.webContentLink;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
