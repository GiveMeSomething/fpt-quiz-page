import { Document, Model, model, Schema } from 'mongoose';
import { currentTimestampInSecond } from '../utils/time';

export interface RefreshToken extends Document {
    userId: string;
    refreshToken: string;
    expires: number;
    iat: number;
    currentAccessToken: string;
    family: string[];
}

export const RefreshTokenSchema: Schema<RefreshToken> = new Schema<RefreshToken>(
    {
        userId: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        expires: {
            type: Number,
            default: 24 * 60 * 60 * 1000, // in ms (1 day)
        },
        iat: {
            type: Number,
            default: currentTimestampInSecond(),
        },
        currentAccessToken: {
            type: String,
            required: true,
        },
        family: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
);

export const RefreshTokenModel: Model<RefreshToken> = model<RefreshToken>('RefreshToken', RefreshTokenSchema);
