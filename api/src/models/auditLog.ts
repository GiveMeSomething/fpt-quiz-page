import { Document, Model, model, Schema } from 'mongoose'

export enum LogStatus {
    OK = 'OK',
    ERR = 'ERR',
}

export interface Log {
    requestDate: string
    path: string
    action: string
    status: LogStatus
}

export interface AuditLog extends Document {
    email: string
    log: Log
    message: string
}

const LogSchema: Schema<Log> = new Schema<Log>({
    requestDate: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
})

export const AuditLogSchema: Schema<AuditLog> = new Schema<AuditLog>({
    email: {
        type: String,
        required: true,
    },
    log: LogSchema,
    message: {
        type: String,
    },
})

export const AuditLogModel: Model<AuditLog> = model<AuditLog>('AuditLog', AuditLogSchema)
