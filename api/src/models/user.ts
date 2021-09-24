import { Document, model, ObjectId, Schema } from 'mongoose';

export interface IUser extends Document {
    id: ObjectId;
    username: string;
    email: string;
    password: string;
    token: string;
}

export const UserSchema = new Schema<IUser>(
    {
        id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
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
    { collection: 'users' },
);

const User = model<IUser>('User', UserSchema);
export default User;
