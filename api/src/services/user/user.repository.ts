import { Model } from 'mongoose';
import 'reflect-metadata';
import { Service } from 'typedi';

import User, { IUser } from '../../models/user';
import ErrorHandler from '../../utils/errorHandler/error';

// Only write operation with database in here
@Service()
export default class UserRepository {
    private readonly userModel: Model<IUser>;

    constructor() {
        this.userModel = User;
    }

    async create(user: IUser): Promise<IUser> {
        const initialUser: IUser = new this.userModel({ ...user });
        const createdUser = await initialUser.save();

        if (!createdUser) {
            throw new ErrorHandler(503, 'Cannot create user');
        }

        return createdUser;
    }

    async findByEmail(email: string) {
        const user = await this.userModel.find({ email });
        return user;
    }
}
