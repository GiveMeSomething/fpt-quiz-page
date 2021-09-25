import { Model } from 'mongoose';
import 'reflect-metadata';
import { Service } from 'typedi';

import UserModel, { User } from '../../models/user';
import ErrorHandler from '../../utils/errorHandler/error';

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

    async findByEmail(email: string) {
        const user = await this.userModel.find({ email });
        return user;
    }
}
