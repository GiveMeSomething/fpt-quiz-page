import 'reflect-metadata';
import passport from 'passport';

import { Router } from 'express';

import { Service } from 'typedi';
import AuthController from '../services/auth/auth.controller';

@Service()
export default class AuthRouter {
    private readonly authController: AuthController;

    constructor(authController: AuthController) {
        this.authController = authController;
    }

    route() {
        const router = Router();

        router.post('/register', this.authController.registerWithPassword);
        router.post('/login', this.authController.login);
        router.post('/refresh_token', this.authController.refreshToken);
        router.post(
            '/sample-protected-path',
            passport.authenticate('jwt', { session: false }),
            this.authController.sampleFunction,
        );

        return router;
    }
}
