import exp from 'constants';
import dotenv from 'dotenv';

import { ExtractJwt, Strategy as JwtStrategy, Strategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import Container, { Inject, Service } from 'typedi';
import { UserModel } from '../../models/user';
import { InternalServerException, UnauthorizedException } from '../../utils/errorHandler/commonError';
import { currentTimestampInSecond, isExpired } from '../../utils/time';
import UserService from '../user/user.service';
import AuthRepository from './auth.repository';
import AuthService from './auth.service';

dotenv.config();
@Service()
class JwtStrategyContainer {
    private readonly userService: UserService;

    private readonly authRepository: AuthRepository;

    constructor(userService: UserService, authRepository: AuthRepository) {
        this.userService = userService;
        this.authRepository = authRepository;

        this.validate = this.validate.bind(this);
    }

    jwtStrategy() {
        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY,
        };

        return new JwtStrategy(options, this.validate);
    }

    async validate(payload: any, done: VerifiedCallback) {
        // payload
        //     sub: userId,
        //     role,
        //     iat,
        //     exp

        if (isExpired(payload.exp)) {
            const userId = payload.sub;

            // If token is expired, save it into refresh token family
            const currentAccessToken = (await this.authRepository.findCurrentAccessToken(userId))?.currentAccessToken;

            if (!currentAccessToken) {
                throw InternalServerException('Cannot get access token from database');
            }

            await this.authRepository.updateRefreshTokenFamily(currentAccessToken, userId);

            // Then return unauthorized
            return done(UnauthorizedException('Unauthorized'));
        }

        try {
            const user = await this.userService.findById(payload.sub);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
}

const jwtStrategyContainer = Container.get(JwtStrategyContainer);
const jwtStrategy = () => jwtStrategyContainer.jwtStrategy();

export default jwtStrategy;
