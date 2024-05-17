import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleService } from '../../api/google/google.service';
import { type drive_v3, google } from 'googleapis';
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
    try {
      const auth = this.googleService.getOAuth2Client();
      this.drive = google.drive({ version: 'v3', auth });
    } catch (error) {
      console.error(error);
    }
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

    if (!response)
      throw new InternalServerErrorException({}, 'no drive files response');

    return {
      id: response.data.id,
      link: this.generatePublicLink(response.data.id),
    };
  }

  public async removeFileById(id: string): Promise<void> {
    return this.drive.files.delete({ fileId: id }).then();
  }

  private generatePublicLink(id: string): string {
    return `https://drive.google.com/thumbnail?id=${id}`;
  }
}
