import 'reflect-metadata';

import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';

import AuthService from './auth.service';
import UserService from '../user/user.service';

import { User } from '../../models/user';
import { AuthResponse } from './auth.type';
import { BadRequestException, UnauthorizedException } from '../../utils/errorHandler/commonError';

@Service()
export default class AuthRouter {
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

        return router;
    }

    async registerWithPassword(req: Request, res: Response, next: NextFunction): Promise<boolean> {
        // Extract user input from request body
        const user: User = { ...req.body };

        try {
            await this.authService.register(user);
        } catch (error) {
            next(error);
        }

        return true;
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw BadRequestException('User not existed. Please register.');
        }

        if (!(await user.checkPassword(password))) {
            throw UnauthorizedException('Wrong combination. Please check then re-login');
        }

        const userToken = await this.authService.login(user);

        res.send(userToken);
    }
}
