import dotenv from 'dotenv';

import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { UserModel } from '../../models/user';
import { UnauthorizedException } from '../../utils/errorHandler/commonError';
import { isExpire } from '../../utils/time';

dotenv.config();

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};

const validate = async (payload: any, done: VerifiedCallback) => {
    console.log(payload);

    if (isExpire(payload.exp)) {
        return done(UnauthorizedException('Unauthorized'));
    }

    try {
        const user = await UserModel.findById(payload.sub);

        if (!user) {
            return done(null, false, { message: 'No user' });
        }

        return done(null, user, { message: 'OK' });
    } catch (err) {
        return done(err);
    }
};

const useJwtStrategy = (passport: any) => {
    passport.use(new JwtStrategy(options, validate));
};

export default useJwtStrategy;
