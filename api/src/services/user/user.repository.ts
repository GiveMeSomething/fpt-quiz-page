import 'reflect-metadata';
import { Service } from 'typedi';

import User, { IUser } from '../../models/user';
import ErrorHandler from '../../utils/errorHandler/error';

@Service()
export default class UserRepository {
    private readonly userModel;

    constructor() {
        this.userModel = User;
    }

    async create(user: IUser) {
        // TODO: Create new user here - remember to check for duplicate
    }

    async findByEmail(email: string) {
        const user = await this.userModel.find({ email });
        return user;
    }
}
