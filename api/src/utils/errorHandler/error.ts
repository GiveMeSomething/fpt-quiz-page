import { NextFunction, Request, Response } from 'express';
import { nextTick } from 'process';

export default class ErrorHandler extends Error {
    public statusCode: number;

    public statusName: string;

    public source: string;

    constructor(statusCode: number = 500, statusName: string = 'INTERNAL_SERVER_ERROR', message: string) {
        super();
        this.statusCode = statusCode;
        this.statusName = statusName;
        this.source = this.stack ? this.stack : 'Unknow cause';
        this.message = message;
    }
}

export function handleError(err: any, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof ErrorHandler) {
        const { statusCode, statusName, source, message } = err;

        console.log(`Error handler told: ${source}`);

        res.status(statusCode).json({
            status: statusName,
            statusCode,
            message,
        });
    } else {
        next(err);
    }
}
