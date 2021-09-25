import { Document, model, ObjectId, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT: number = 10;
export interface IUser extends Document {
    email: string;
    password: string;
    token: string;
}

export const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        token: {
            type: String,
        },
    },
    { timestamps: true },
);

UserSchema.pre('save', async function preSave(next: any) {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, SALT);
        } catch (err) {
            next(err);
        }
    }
    next();
});

const User = model<IUser>('User', UserSchema);
export default User;
