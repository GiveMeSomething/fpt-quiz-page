import 'reflect-metadata';
import express from 'express';
import { Service } from 'typedi';
import AuthService from '../services/auth/auth.service';
import { User } from '../models/user';

@Service()
export default class AuthRouter {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    route() {
        const router = express.Router();

        router.post('/register', async (req, res, next) => {
            // Will try something more specific than this
            const user: User = { ...req.body };

            try {
                const result = await this.authService.register(user);
                res.send(result);
            } catch (error) {
                next(error);
            }
        });

        return router;
    }
}
