import 'reflect-metadata';

import * as jwt from 'jsonwebtoken';

import { Service } from 'typedi';
import { User } from '../../models/user';
import UserService from '../user/user.service';
import { AuthResponse } from './auth.type';
import issueJwt from '../../utils/jwt/issueJwt';

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
