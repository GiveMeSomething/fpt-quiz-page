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
        router.post('/login', this.authController.loginWithPassword);
        router.post(
            '/refresh-token',
            passport.authenticate('jwt', { session: false }),
            this.authController.refreshToken,
        );

        router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
            res.json({ status: 'Authorized' });
        });

        return router;
    }
}
