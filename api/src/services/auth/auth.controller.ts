import 'reflect-metadata';

import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';

import AuthService from './auth.service';
import UserService from '../user/user.service';
import { User } from '../../models/user';
import { BadRequestException, UnauthorizedException } from '../../utils/errorHandler/commonError';
import { RefreshTokenResponse } from './auth.type';

@Service()
export default class AuthController {
    private readonly authService: AuthService;

    private readonly userService: UserService;

    constructor(authService: AuthService, userService: UserService) {
        this.authService = authService;
        this.userService = userService;

        this.registerWithPassword = this.registerWithPassword.bind(this);
        this.loginWithPassword = this.loginWithPassword.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }

    async registerWithPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Extract user input from request body
        const user: User = { ...req.body };

        try {
            await this.authService.register(user);
        } catch (error) {
            next(error);
        }

        res.json({
            success: true,
            message: 'User registered. Please check email',
        });
    }

    async loginWithPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;

        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                throw BadRequestException('User not existed. Please register.');
            }

            if (!(await user.checkPassword(password))) {
                throw UnauthorizedException('Wrong combination. Please check then re-login');
            }

            await this.sendTokenToClient(res, user, true);
        } catch (err) {
            next(err);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        // Get refresh token from cookie
        const refreshToken = req.cookies['fpt-refresh-token'];

        try {
            // Verify token
            const payload = await this.authService.verifyRefreshToken(refreshToken);
            if (!payload) {
                throw UnauthorizedException('Unauthoirized');
            }

            // Get user info to issue new token
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw BadRequestException('User not existed');
            }

            // Send !
            await this.sendTokenToClient(res, user);
        } catch (err) {
            next(err);
        }
    }

    async sendTokenToClient(res: Response, user: User, isLogin?: boolean) {
        const { refreshToken, ...userToken } = await this.authService.fetchToken(user, isLogin);

        // Save refresh token to HttpOnly cookies
        res.cookie('fpt-refresh-token', refreshToken.accessToken, {
            maxAge: refreshToken.expires,
            httpOnly: true,
        });

        // Send back JWT to client
        res.send(userToken);
    }
}
