import exp from 'constants'
import dotenv from 'dotenv'

import { ExtractJwt, Strategy as JwtStrategy, Strategy, StrategyOptions, VerifiedCallback } from 'passport-jwt'
import Container, { Inject, Service } from 'typedi'
import { UserModel } from '../../models/user'
import { InternalServerException, UnauthorizedException } from '../../utils/errorHandler/commonError'
import { currentTimestampInSecond, isExpired } from '../../utils/time'
import UserService from '../user/user.service'
import AuthRepository from './auth.repository'
import AuthService from './auth.service'

dotenv.config()
@Service()
class JwtStrategyContainer {
    private readonly userService: UserService

    private readonly authRepository: AuthRepository

    constructor(userService: UserService, authRepository: AuthRepository) {
        this.userService = userService
        this.authRepository = authRepository

        this.validate = this.validate.bind(this)
    }

    jwtStrategy() {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.TOKEN_SECRET_KEY,
        }

        return new JwtStrategy(options, this.validate)
    }

    async validate(payload: any, done: VerifiedCallback) {
        // payload
        //     sub: userId,
        //     role,
        //     iat,
        //     exp

        try {
            const user = await this.userService.findById(payload.sub)

            if (!user) {
                return done(null, false)
            }

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
}

const jwtStrategyContainer = Container.get(JwtStrategyContainer)
const jwtStrategy = () => jwtStrategyContainer.jwtStrategy()

export default jwtStrategy
