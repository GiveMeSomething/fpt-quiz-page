import { Request, Response } from 'express';

export default class ErrorHandler extends Error {
    private statusCode: Number;

    constructor(statusCode: Number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const handleError = (err: any, req: Request, res: Response) => {
    const { statusCode = 500, message = `Oops! ${err}` } = err;

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
