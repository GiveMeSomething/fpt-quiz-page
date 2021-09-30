import 'reflect-metadata';

import { Service } from 'typedi';

import issueJwt from '../../utils/jwt/jwtUtils';
import UserService from '../user/user.service';

import { User } from '../../models/user';
import { JwtResponse } from './auth.type';
import AuthRepository from './auth.repository';
import { InternalServerException } from '../../utils/errorHandler/commonError';

@Service()
export default class AuthService {
    private readonly userService: UserService;

    private readonly authRepository: AuthRepository;

    constructor(userService: UserService, authRepository: AuthRepository) {
        this.authRepository = authRepository;

        this.userService = userService;
    }

    async register(user: User): Promise<User> {
        // Create new user document in database
        const newUser = await this.userService.create(user);

        // Send verification email (later)

        // Send back created user
        return newUser;
    }

    async login(user: User): Promise<JwtResponse> {
        // Request new jwt
        const token = issueJwt(user);

        // Check refresh token with database then renew it
        const savedRefreshToken = await this.authRepository.findByUserId(user._id);

        // Delete old refresh token
        if (savedRefreshToken) {
            this.authRepository.removeByUserId(user._id);
        }

        // Save new refresh token
        const newRefreshToken = await this.authRepository.create(token.refreshToken, user._id);

        if (!newRefreshToken) {
            throw InternalServerException('Cannot save new refresh token');
        }

        // Return jwt, refreshToken to controller, refreshToken then saved to client cookie
        return token;
    }
}
