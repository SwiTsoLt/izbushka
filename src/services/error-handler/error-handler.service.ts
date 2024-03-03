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

      if (result === null || result === undefined) {
        throw new NotFoundException();
      }

      return result;
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        throw new UnauthorizedException();
      }

      if (error.status === 404) {
        throw new NotFoundException();
      }

      if (error.kind === 'ObjectId') {
        throw new BadRequestException();
      }

      if (error?.response?.data?.error === 'invalid_grant') {
        throw new UnauthorizedException(
          {
            ...error?.response?.data,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            request: error?.response?.request,
          },
          {
            cause: error?.response?.data?.error,
            description: error?.response?.data?.error_description,
          },
        );
      }

      throw new InternalServerErrorException();
    }
  }
}
