import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // 커스텀 에러 형식
        const errorResponse = {
            statusCode: status,
            message: exceptionResponse['message'] || 'Internal server error',
            error: exceptionResponse['error'] || 'Unknown Error',
        };

        response.status(status).json(errorResponse);
    }
}
