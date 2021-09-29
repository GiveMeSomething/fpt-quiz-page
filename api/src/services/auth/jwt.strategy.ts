import dotenv from 'dotenv';

import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { UserModel } from '../../models/user';
import { JwtPayload } from './auth.type';

dotenv.config();

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
};

const validate = async (payload: JwtPayload, done: VerifiedCallback) => {
    console.log(payload);

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
