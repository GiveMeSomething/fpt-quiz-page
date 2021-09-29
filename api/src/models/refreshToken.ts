import { Document, Model, model, Schema } from 'mongoose';

export interface RefreshToken extends Document {
    userId: string;
    token: string;
}

export const RefreshTokenSchema: Schema<RefreshToken> = new Schema<RefreshToken>({
    userId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

export const RefreshTokenModel: Model<RefreshToken> = model<RefreshToken>('RefreshToken', RefreshTokenSchema);
