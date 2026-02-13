import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { DuplicateEmailException } from '@/domain/member/duplicate-email.exception';
import { DuplicateProfileException } from '@/domain/member/duplicate-profile.exception';

@Catch()
export class ApiControllerAdvice implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    let status: HttpStatus;
    let message: string;

    if (
      exception instanceof DuplicateEmailException ||
      exception instanceof DuplicateProfileException
    ) {
      status = HttpStatus.CONFLICT;

      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();

      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      message =
        exception instanceof Error
          ? exception.message
          : 'Internal server error';
    }

    response.status(status).json({
      exception: exception.name,
      statusCode: status,
      timestamp: new Date().toISOString(),
      detail: message,
    });

    // const problemDetail: ProblemDetail = {
    //   status,
    //   detail: message,
    //   timestamp: new Date().toISOString(),
    //   exception:
    //     exception instanceof Error
    //       ? exception.constructor.name
    //       : 'UnknownException',
    // };
    //
    // response.status(status).json(problemDetail);
  }
}
