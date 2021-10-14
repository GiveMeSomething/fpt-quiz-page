import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { Log, LogStatus } from '../models/auditLog';
import LogService from '../services/log/log.service';
import { currentTimestampInString } from '../utils/time';

@Service()
export default class LogMiddleware {
    private readonly logService: LogService;

    constructor(logService: LogService) {
        this.logService = logService;

        this.startLog = this.startLog.bind(this);
        this.endLog = this.endLog.bind(this);
    }

    async startLog(req: any, res: Response, next: NextFunction) {
        let requester = 'unknown';

        // eslint-disable-next-line prefer-destructuring
        const user = req.user;
        const { email } = req.body;
        const requestURL = req.originalUrl;

        if (user) {
            // If user exist => authenticated by passport
            requester = user.email;
        }
        let message = `START: ${requester} request ${requestURL}`;
        if (email) {
            // If email exist => user login/register
            message += `, with email: ${email}`;
        }

        const log: Log = {
            action: req.method,
            requestDate: currentTimestampInString(),
            path: requestURL,
            status: LogStatus.OK,
        };
        await this.logService.createNewLog(requester, message, log);

        next();
    }

    async endLog(err: any, req: any, res: Response, next: NextFunction) {
        let requester = 'unknown';

        // eslint-disable-next-line prefer-destructuring
        const user = req.user;
        const requestURL = req.originalUrl;

        if (user) {
            // If user exist => authenticated by passport
            requester = user.email;
        }

        // Construct log message
        let message;
        let logStatus = LogStatus.OK;

        if (err) {
            message =
                `ERR: ${requester} request ${requestURL}, ` +
                `statusCode: ${err.statusCode ? err.statusCode : 'unknown'}, ` +
                `statusName: ${err.statusName ? err.statusName : 'unknown'} `;

            logStatus = LogStatus.ERR;
        } else {
            message = `DONE: ${requester} request ${requestURL}`;
        }

        // Create log sub-document
        const log: Log = {
            action: req.method,
            requestDate: currentTimestampInString(),
            path: requestURL,
            status: logStatus,
        };
        await this.logService.createNewLog(requester, message, log);

        next(err);
    }
}
