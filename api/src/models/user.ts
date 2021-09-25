import { Document, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT: number = 10;
export interface IUser extends Document {
    email: string;
    password: string;
}

export const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
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

const User: Model<IUser> = model<IUser>('User', UserSchema);
export default User;
