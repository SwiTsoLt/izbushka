import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  public async handleError<T>(promise: Promise<T>): Promise<T> {
    try {
      const result: T = await promise;

      if (!result) {
        throw new NotFoundException();
      }

      return result;
    } catch (error) {
      if (error.status === 401) {
        throw new UnauthorizedException();
      }

      if (error.status === 404) {
        throw new NotFoundException();
      }

      if (error.kind === 'ObjectId') {
        throw new BadRequestException();
      }

      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
