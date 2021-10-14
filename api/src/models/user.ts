import { Document, Model, model, Schema } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { RoleEnum } from '../services/user/user.variable'

const SALT: number = 10
export interface User extends Document {
    email: string
    password: string
    role: RoleEnum
    checkPassword: (password: string) => Promise<boolean>
}

export const UserSchema: Schema<User> = new Schema<User>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: RoleEnum,
        },
    },
    { timestamps: true },
)

UserSchema.methods.checkPassword = async function checkPassword(password: string) {
    return bcrypt.compare(password, this.password)
}

UserSchema.pre('save', async function preSave(next: any) {
    // Save hash password into database
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, SALT)
        } catch (err) {
            next(err)
        }
    }

    // Force register as normal user
    this.role = RoleEnum.USER

    next()
})

export const UserModel: Model<User> = model<User>('User', UserSchema)
