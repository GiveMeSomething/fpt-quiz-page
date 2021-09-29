import 'reflect-metadata';

import { Model } from 'mongoose';
import { Service } from 'typedi';

import { User, UserModel } from '../../models/user';
import { Undefinable } from '../../@types/app.type';
import { ServiceUnavailableException } from '../../utils/errorHandler/commonError';

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
            throw ServiceUnavailableException('Cannot create new user');
        }

        return createdUser;
    }

    async findByEmail(email: string): Promise<Undefinable<User>> {
        return this.userModel.findOne({ email }).exec();
    }
}
