import { Model } from 'mongoose';
import { Service } from 'typedi';
import { Log, AuditLogModel, AuditLog } from '../../models/auditLog';

@Service()
export default class LogRepository {
    private readonly auditLogModel: Model<AuditLog>;

    constructor() {
        this.auditLogModel = AuditLogModel;
    }

    async create(email: string, message: string, log: Log): Promise<AuditLog> {
        const logDoc = new this.auditLogModel({ email, message, log });
        return logDoc.save();
    }
}
