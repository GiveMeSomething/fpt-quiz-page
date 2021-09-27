import 'reflect-metadata';
import { NextFunction, Request, Response, Router } from 'express';
import { Service } from 'typedi';
import AuthService from './auth.service';
import { User } from '../../models/user';

@Service()
export default class AuthRouter {
    private readonly authService: AuthService;

    private router: any;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.router = Router();
    }

    route() {
        this.router.post('/register', this.registerWithPassword);
        this.router.post('/login', this.login);

        return this.router;
    }

    async registerWithPassword(req: Request, res: Response, next: NextFunction) {
        const user: User = { ...req.body };

        try {
            const result = await this.authService.register(user);
            res.send(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        // Do something when user login
    }
}
