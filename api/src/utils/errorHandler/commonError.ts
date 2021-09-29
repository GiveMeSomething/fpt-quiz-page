import ErrorHandler from './error';

export const BadRequestException = (message: string) => new ErrorHandler(400, 'BAD_REQUEST', message);
export const UnauthorizedException = (message: string) => new ErrorHandler(401, 'UNAUTHORIZED', message);
export const NotFoundException = (message: string) => new ErrorHandler(404, 'NOT_FOUND', message);
export const InternalServerException = (message: string) => new ErrorHandler(500, 'INTERNAL_SERVER_ERROR', message);
export const NotImplementedException = (message: string) => new ErrorHandler(501, 'NOT_IMPLEMENTED', message);
export const ServiceUnavailableException = (message: string) => new ErrorHandler(503, 'SERVICE_UNAVAILABLE', message);
