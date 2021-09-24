import 'reflect-metadata';
import { Service } from 'typedi';

import User from '../../models/user';

@Service()
export default class AuthRepository {
    private readonly userModel;

    constructor() {
        this.userModel = User;
    }

    async isDuplicate(uniqueField: any) {
        const user = await User.findOne({});
        return user;
    }
}
