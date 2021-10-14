import 'reflect-metadata'
import passport from 'passport'

import { Router } from 'express'

import { Service } from 'typedi'
import AuthController from '../services/auth/auth.controller'
import AuthMiddleware from '../middleware/auth.middleware'
import LogMiddleware from '../middleware/log.middleware'

@Service()
export default class AuthRouter {
    private readonly authController: AuthController

    private readonly authMiddleware: AuthMiddleware

    private readonly logMiddleware: LogMiddleware

    constructor(authController: AuthController, authMiddleware: AuthMiddleware, logMiddleware: LogMiddleware) {
        this.authController = authController
        this.authMiddleware = authMiddleware
        this.logMiddleware = logMiddleware
    }

    route() {
        const router = Router()

        router.post('/register', this.authController.registerWithPassword)
        router.post('/login', this.authController.loginWithPassword)
        router.post(
            '/refresh-token',
            this.authMiddleware.verifyRefreshToken,
            passport.authenticate('jwt', { session: false }),
            this.authController.refreshToken,
        )

        router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
            res.json({ status: 'Authorized' })
        })

        return router
    }
}
