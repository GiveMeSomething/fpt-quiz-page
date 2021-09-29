import 'reflect-metadata';

import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';

import passport from 'passport';
import AuthService from './auth.service';
import UserService from '../user/user.service';
import { User } from '../../models/user';
import {
    BadRequestException,
    NotImplementedException,
    UnauthorizedException,
} from '../../utils/errorHandler/commonError';

@Service()
export default class AuthController {
    private readonly authService: AuthService;

    private readonly userService: UserService;

    constructor(authService: AuthService, userService: UserService) {
        this.authService = authService;
        this.userService = userService;

        this.registerWithPassword = this.registerWithPassword.bind(this);
        this.login = this.login.bind(this);
    }

    route() {
        const router = Router();

        router.post('/register', this.registerWithPassword);
        router.post('/login', this.login);
        router.post('/testing', passport.authenticate('jwt', { session: false }), this.testUsingToken);
        router.post('/refresh_token', this.refreshToken);

        return router;
    }

    async testUsingToken(req: Request, res: Response) {
        res.send('Hello World');
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

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw BadRequestException('User not existed. Please register.');
        }

        if (!(await user.checkPassword(password))) {
            throw UnauthorizedException('Wrong combination. Please check then re-login');
        }

        try {
            const userToken = await this.authService.login(user);
            res.send(userToken);
        } catch (err) {
            next(err);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        throw NotImplementedException('Wait for it!');
    }
}
