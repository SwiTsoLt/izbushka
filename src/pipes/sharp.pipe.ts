import { Injectable, type PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as uuid from 'uuid';
import { ISharpResult } from '../interfaces/sharp.interface';

@Injectable()
export class SharpPipe
  implements PipeTransform<Express.Multer.File[], Promise<ISharpResult>>
{
  async transform(images: Express.Multer.File[]): Promise<ISharpResult> {
    if (!images?.length)
      return Promise.resolve({ name: '', buffer: Buffer.from('') });
    const image = images[0];
    const originalName = path.parse(image.originalname).name;
    const id = uuid.v4();
    const name = `${id}-${originalName}.webp`;
    const { buffer } = image;
    const sharpBuffer = await sharp(buffer)
      .resize(800)
      .webp({ quality: 20 })
      .toBuffer();
    return { name, buffer: sharpBuffer };
  }
}
