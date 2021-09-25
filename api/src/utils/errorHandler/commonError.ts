import ErrorHandler from './error';

export const BadRequestException = (message: string) => new ErrorHandler(400, message);
export const NotFoundException = (message: string) => new ErrorHandler(404, message);
export const UnauthorizedException = (message: string) => new ErrorHandler(401, message);
