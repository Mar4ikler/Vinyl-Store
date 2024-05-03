// import { Catch, ExceptionFilter, ArgumentsHost, BadRequestException } from '@nestjs/common';
// import { ValidationException } from 'class-validator';

// @Catch(ValidationException)
// export class ValidationExceptionFilter implements ExceptionFilter {
//  catch(exception: ValidationException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();
//     const status = 406;

//     response
//       .status(status)
//       .json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//         message: exception.message,
//       });
//  }
// }
