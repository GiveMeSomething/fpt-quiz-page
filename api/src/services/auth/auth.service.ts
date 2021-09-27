import 'reflect-metadata';
import { Service } from 'typedi';
import { User } from '../../models/user';
import { BadRequestException } from '../../utils/errorHandler/commonError';
import UserService from '../user/user.service';

@Service()
export default class AuthService {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(user: User): Promise<Boolean> {
        try {
            await this.userService.create(user);
        } catch (err: any) {
            throw BadRequestException(err);
        }

        return true;
    }
}
