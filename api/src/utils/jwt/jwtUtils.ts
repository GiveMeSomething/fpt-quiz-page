import * as jwt from 'jsonwebtoken';

import { User } from '../../models/user';
import { RefreshTokenPayload, RefreshTokenResponse, JwtPayload } from '../../services/auth/auth.type';
import { InternalServerException } from '../errorHandler/commonError';
import { currentTimestampInSecond } from '../time';

export const getSecretKey = () => {
    const secret = process.env.SECRET_KEY;

    if (!secret) {
        throw InternalServerException('Secret key not found');
    }

    return secret;
};

function issueToken(payload: any, expiresIn: number | string): string {
    return jwt.sign(payload, getSecretKey(), { expiresIn });
}

// Currently use time as payload (will look into it later)
function issueRefreshToken(user: User): RefreshTokenResponse {
    const payload: RefreshTokenPayload = {
        sub: user._id,
        iat: currentTimestampInSecond(),
    };

    // Refresh token can be used up to a week
    const expiresIn = 7 * 24 * 60 * 60 * 1000;

    const token = issueToken(payload, expiresIn);
    return {
        accessToken: token,
        expires: expiresIn,
    };
}

export function issueJwt(user: User) {
    const payload: JwtPayload = {
        sub: user._id,
        role: user.role,
        iat: currentTimestampInSecond(),
    };

    // Set expireTime to 15min (in ms)
    // const expiresIn = 15 * 60 * 1000;
    const expiresIn = 100000;

    const token = issueToken(payload, expiresIn);

    return {
        accessToken: token,
        refreshToken: issueRefreshToken(user),
        expires: expiresIn,
        tokenType: 'Bearer',
    };
}
