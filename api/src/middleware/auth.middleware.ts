import { NextFunction, Request, Response } from 'express'
import { Service } from 'typedi'
import AuthService from '../services/auth/auth.service'
import { UnauthorizedException } from '../utils/errorHandler/commonError'

@Service()
export default class AuthMiddleware {
    private readonly authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService

        this.verifyRefreshToken = this.verifyRefreshToken.bind(this)
    }

    async verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            // Get refresh token from cookie
            const refreshToken = req.cookies['fpt-refresh-token']

            // Verify refresh token
            const payload = await this.authService.verifyRefreshToken(refreshToken)
            if (!payload) {
                throw UnauthorizedException('Unauthoirized')
            }

            next()
        } catch (err) {
            next(err)
        }
    }
}
