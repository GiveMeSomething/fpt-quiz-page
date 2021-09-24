import 'reflect-metadata';
import { Service } from 'typedi';
import { IUser } from '../../models/user';
import UserService from '../user/user.service';

@Service()
export default class AuthService {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(user: IUser) {
        const result = await this.userService.create(user);

        return result;
    }
}
