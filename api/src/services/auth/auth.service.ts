import 'reflect-metadata';

import * as jwt from 'jsonwebtoken';

import { Service } from 'typedi';
import { User } from '../../models/user';
import { BadRequestException, UnauthorizedException } from '../../utils/errorHandler/commonError';
import UserService from '../user/user.service';
import { AuthResponse } from './auth.type';

@Service()
export default class AuthService {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(user: User): Promise<User> {
        // Create new user document in database
        const newUser = await this.userService.create(user);

        // Send verification email (later)

        // Send back created user
        return newUser;
    }

    async login(user: User): Promise<AuthResponse> {
        const payload = { email: user.email, role: user.role, sub: user._id };
        const secretKey: any = process.env.JWT_SECRET_KEY;
        return {
            accessToken: jwt.sign(payload, secretKey),
        };
    }
}
