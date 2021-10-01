import 'reflect-metadata';

import { Service } from 'typedi';
import { NextFunction, Request, Response } from 'express';

import AuthService from './auth.service';
import UserService from '../user/user.service';

import { User } from '../../models/user';
import { UserArgs } from '../../@types/app.type';
import { BadRequestException, UnauthorizedException } from '../../utils/errorHandler/commonError';

@Service()
export default class AuthController {
    private readonly authService: AuthService;

    private readonly userService: UserService;

    constructor(authService: AuthService, userService: UserService) {
        this.authService = authService;
        this.userService = userService;

        this.registerWithPassword = this.registerWithPassword.bind(this);
        this.loginWithPassword = this.loginWithPassword.bind(this);
        this.sendTokenToClient = this.sendTokenToClient.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }

    async registerWithPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Extract user input from request body
        const user: User = { ...req.body };

        try {
            await this.authService.register(user);

            res.json({
                success: true,
                message: 'User registered',
            });
        } catch (error) {
            next(error);
        }
    }

    async loginWithPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;

        try {
            // Check if user existed
            const user = await this.userService.findByEmail(email);

            if (!user) {
                throw BadRequestException('User not existed. Please register.');
            }

            // Check user input credentials
            if (!(await user.checkPassword(password))) {
                throw UnauthorizedException('Wrong combination. Please check then re-login');
            }

            // Send back accessToken
            await this.sendTokenToClient(res, { userId: user._id, role: user.role }, true);
        } catch (err) {
            next(err);
        }
    }

    // This path is authenticate by passport
    // The req.user will contain payload info
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw BadRequestException('User not existed');
            }

            // Get user info to issue new token
            const user = { userId: req.user?._id, role: req.user.role };

            // Send back accessToken
            await this.sendTokenToClient(res, user);
        } catch (err) {
            next(err);
        }
    }

    async sendTokenToClient(res: Response, user: UserArgs, isLogin?: boolean) {
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
