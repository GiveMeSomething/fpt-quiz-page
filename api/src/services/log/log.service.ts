import { Service } from 'typedi'
import { Log } from '../../models/auditLog'
import { InternalServerException } from '../../utils/errorHandler/commonError'
import LogRepository from './log.repository'

@Service()
export default class LogService {
    private readonly logRepository: LogRepository

    constructor(logRepository: LogRepository) {
        this.logRepository = logRepository
    }

    async createNewLog(email: string, message: string, log: Log): Promise<boolean> {
        const savedLog = this.logRepository.create(email, message, log)

        if (!savedLog) {
            throw InternalServerException('Cannot save log')
        }

        return true
    }
}
