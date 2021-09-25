import { Document, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT: number = 10;
export interface User extends Document {
    email: string;
    password: string;
}

export const UserSchema: Schema<User> = new Schema<User>(
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

const UserModel: Model<User> = model<User>('User', UserSchema);

export default UserModel;
