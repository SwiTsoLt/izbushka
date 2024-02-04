import { Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as uuid from 'uuid';

export interface IMultiSharpResult {
  buffer: Buffer;
  name: string;
}

@Injectable()
export class MultiSharpPipe
  implements PipeTransform<Express.Multer.File[], Promise<IMultiSharpResult[]>>
{
  async transform(images: Express.Multer.File[]): Promise<IMultiSharpResult[]> {
    return new Promise<IMultiSharpResult[]>((resolve) => {
      const bufferArray: IMultiSharpResult[] = [];

      images.forEach(async (image, index) => {
        const originalName = path.parse(image.originalname).name;
        const id = uuid.v4();
        const name = `${id}-${originalName}.webp`;
        const { buffer } = image;
        const sharpBuffer = await sharp(buffer)
          .resize(800)
          .webp({ quality: 20 })
          .toBuffer();
        bufferArray.push({ buffer: sharpBuffer, name });

        if (index >= images.length - 1) {
          resolve(bufferArray);
        }
      });
    });
  }
}
