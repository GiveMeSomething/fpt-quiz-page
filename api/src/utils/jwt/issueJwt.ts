import * as jwt from 'jsonwebtoken';

import { User } from '../../models/user';
import { RefreshTokenPayload, AuthResponse } from '../../services/auth/auth.type';
import { InternalServerException } from '../errorHandler/commonError';

const currentTimestampInSecond = (): number => Math.floor(Date.now() / 1000);

const issueToken = (payload: any, expiresIn: number | string): string => {
    const secret = process.env.SECRET_KEY;

    if (!secret) {
        throw InternalServerException('Secret key not found');
    }

    return jwt.sign(payload, secret, { expiresIn });
};

// Currently use time as payload (will look into it later)
const refreshToken = (user: User): string => {
    const payload: RefreshTokenPayload = {
        sub: user._id,
        iat: currentTimestampInSecond(),
    };

    // Refresh token can be used up to a week
    const expiresIn = 15 * 60 * 1000;

    return issueToken(payload, expiresIn);
};

export default function issueJwt(user: User): AuthResponse {
    const payload: jwt.JwtPayload = {
        sub: user._id,
        role: user.role,
        iat: currentTimestampInSecond(),
    };

    // Set expireTime to 15min (in ms)
    const expiresIn = 15 * 60 * 1000;

    const token = issueToken(payload, expiresIn);

    return {
        accessToken: token,
        refreshToken: refreshToken(user),
        expires: expiresIn,
        tokenType: 'Bearer',
    };
}
