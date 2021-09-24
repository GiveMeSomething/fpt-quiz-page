import 'reflect-metadata';
import express from 'express';
import { Service } from 'typedi';

import AuthService from '../services/auth/auth.service';

@Service()
export default class AuthRouter {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    route() {
        const router = express.Router();

        router.post('/register', async (req, res) => {
            const user = await this.authService.isDuplicate('something');
            res.send(user);
        });

        return router;
    }
}
