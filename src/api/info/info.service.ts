import { Injectable } from '@nestjs/common';
import { GetInfoResponseDTO } from '../../dtos/info.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { Post } from '../../schemas/post.schema';

@Injectable()
export class InfoService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  public async getInfo(): Promise<GetInfoResponseDTO> {
    const postsCount = await this.errorHandlerService.handleError<number>(
      this.postModel.countDocuments(),
    );

    return { postsCount };
  }
}
