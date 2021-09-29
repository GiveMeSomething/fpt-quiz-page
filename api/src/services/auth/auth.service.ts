import 'reflect-metadata';

import { Service } from 'typedi';

import issueJwt from '../../utils/jwt/issueJwt';
import UserService from '../user/user.service';

import { User } from '../../models/user';
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
        // Request new jwt
        const token = issueJwt(user);

        // Save refresh token to database

        return token;
    }
}
