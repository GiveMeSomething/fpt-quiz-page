import 'reflect-metadata'
import * as jwt from 'jsonwebtoken'

import { Service } from 'typedi'

import UserService from '../user/user.service'
import AuthRepository from './auth.repository'

import { User } from '../../models/user'
import { JwtResponse } from './auth.type'
import { isExpired } from '../../utils/time'
import { RefreshToken } from '../../models/refreshToken'
import { Undefinable, UserArgs } from '../../@types/app.type'
import { issueJwt, getSecretKey } from '../../utils/jwt/jwtUtils'
import { UnauthorizedException } from '../../utils/errorHandler/commonError'

@Service()
export default class AuthService {
    private readonly userService: UserService

    private readonly authRepository: AuthRepository

    constructor(userService: UserService, authRepository: AuthRepository) {
        this.authRepository = authRepository
        this.userService = userService
    }

    async register(user: User): Promise<User> {
        // Create new user document in database
        const newUser = await this.userService.create(user)

        // Send verification email (later)

        // Send back created user
        return newUser
    }

    async verifyRefreshToken(refreshToken: string): Promise<any> {
        const secret = getSecretKey()
        const payload: any = jwt.verify(refreshToken, secret)

        // Find existed refresh token in database
        const savedToken: Undefinable<RefreshToken> = await this.authRepository.findRefreshTokenByUserId(payload.sub)
        if (!savedToken) {
            throw UnauthorizedException('Refresh token not available. Please login')
        }

        // TODO: add mechanism to notify user
        if (!savedToken.valid) {
            throw UnauthorizedException('Refresh token is stolen. Please login')
        }

        // Check if the token exist in family
        const refreshTokenFamily: string[] = savedToken.family
        if (refreshTokenFamily.includes(refreshToken)) {
            throw UnauthorizedException('Refresh token not available. Please login')
        }

        // Check refresh token's expiration
        const isTokenExpired = isExpired(payload.exp)
        if (isTokenExpired) {
            throw UnauthorizedException('Refresh token expired. Please login')
        }

        return payload
    }

    async fetchToken(user: UserArgs, isLogin?: boolean): Promise<JwtResponse> {
        // Request new jwt
        const { userId } = user
        const token = issueJwt(user)

        // Get current refresh token, else create one (e.g. when user login)
        const currentRefreshToken: Undefinable<RefreshToken> = await this.authRepository.findRefreshTokenByUserId(
            userId,
        )

        // Refresh token rotation, issue new token each time requested
        // Only when login, the system can create new token
        if (!currentRefreshToken) {
            if (!isLogin) {
                throw UnauthorizedException('User not authorized by refresh token.')
            }
            await this.authRepository.createRefreshTokenDocument(token.refreshToken, token.accessToken, userId)
        } else {
            await this.authRepository.updateRefreshTokenDocument(token.refreshToken, token.accessToken, userId)
        }

        // Return object contain accessToken and refreshToken
        return token
    }
}
