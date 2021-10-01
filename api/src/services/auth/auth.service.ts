import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';

import { Service } from 'typedi';

import UserService from '../user/user.service';
import AuthRepository from './auth.repository';

import { User } from '../../models/user';
import { JwtResponse } from './auth.type';
import { InternalServerException, UnauthorizedException } from '../../utils/errorHandler/commonError';
import { isExpired } from '../../utils/time';
import { RefreshToken } from '../../models/refreshToken';
import { Undefinable, UserArgs } from '../../@types/app.type';
import { issueJwt, getSecretKey } from '../../utils/jwt/jwtUtils';

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

    async verifyRefreshToken(refreshToken: string): Promise<any> {
        const secret = getSecretKey();
        const payload: any = jwt.verify(refreshToken, secret);

        const savedToken: Undefinable<RefreshToken> = await this.authRepository.findRefreshTokenByUserId(payload.sub);
        if (!savedToken) {
            throw UnauthorizedException('Refresh token not available. Please login');
        }

        if (!savedToken.valid) {
            // Do something to notify the user that someone try to access account
            throw UnauthorizedException('Refresh token is stolen. Please login');
        }

        // Check if the token exist in family
        const refreshTokenFamily: string[] = savedToken.family;
        if (refreshTokenFamily.includes(refreshToken)) {
            throw UnauthorizedException('Refresh token not available. Please login');
        }

        const isTokenExpired = isExpired(payload.exp);
        if (isTokenExpired) {
            throw UnauthorizedException('Refresh token expired. Please login');
        }

        return payload;
    }

    async fetchToken(user: UserArgs, isLogin?: boolean): Promise<JwtResponse> {
        const { userId } = user;
        // Request new jwt
        const token = issueJwt(user);

        // Get current refresh token, else create one (e.g. when user login)
        const currentRefreshToken: Undefinable<RefreshToken> = await this.authRepository.findRefreshTokenByUserId(
            userId,
        );

        // Refresh token rotation, issue new token each time requested
        // Only when login, the system create new token
        if (!currentRefreshToken) {
            if (!isLogin) {
                throw UnauthorizedException('User not authorized by refresh token');
            }
            await this.authRepository.createRefreshToken(token.refreshToken, token.accessToken, userId);
        } else {
            await this.authRepository.updateRefreshToken(token.refreshToken, token.accessToken, userId);
        }

        // Return jwt, refreshToken to controller, refreshToken then saved to client cookie
        return token;
    }

    async saveExpiredAccessToken(accessToken: string, userId: string): Promise<boolean> {
        const result = await this.authRepository.updateRefreshTokenFamily(accessToken, userId);

        if (!result) {
            throw InternalServerException('Cannot save expired token');
        }

        return true;
    }
}
