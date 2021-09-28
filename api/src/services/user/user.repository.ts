import 'reflect-metadata';

import { Model } from 'mongoose';
import { Service } from 'typedi';

import UserModel, { User } from '../../models/user';
import ErrorHandler from '../../utils/errorHandler/error';
import { Undefinable } from '../../@types/app.type';

// Only write operation with database in here
@Service()
export default class UserRepository {
    private readonly userModel: Model<User>;

    constructor() {
        this.userModel = UserModel;
    }

    async create(user: User): Promise<User> {
        const initialUser: User = new this.userModel({ ...user });
        const createdUser = await initialUser.save();

        if (!createdUser) {
            throw new ErrorHandler(503, 'Cannot create user');
        }

        return createdUser;
    }

    async findByEmail(email: string): Promise<Undefinable<User>> {
        return this.userModel.findOne({ email }).exec();
    }
}
