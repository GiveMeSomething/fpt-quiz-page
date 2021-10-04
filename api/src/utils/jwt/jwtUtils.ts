import * as jwt from 'jsonwebtoken';
import { UserArgs } from '../../@types/app.type';

import { User } from '../../models/user';
import { RefreshTokenPayload, RefreshTokenResponse, JwtPayload } from '../../services/auth/auth.type';
import { InternalServerException } from '../errorHandler/commonError';
import { currentTimestampInSecond } from '../time';

// The time is in second(s) due to my configuration (not in 'ms' like jwt docs)
export const getSecretKey = () => {
    const secret = process.env.TOKEN_SECRET_KEY;

    if (!secret) {
        throw InternalServerException('Secret key not found');
    }

    return secret;
};

function issueToken(payload: any, expiresIn: number | string): string {
    return jwt.sign(payload, getSecretKey(), { expiresIn });
}

// Currently use time as payload (will look into it later)
function issueRefreshToken(userId: string): RefreshTokenResponse {
    const payload: RefreshTokenPayload = {
        sub: userId,
        iat: currentTimestampInSecond(),
    };

    // Refresh token can be used up to a week
    const expiresIn = 7 * 24 * 60 * 60;

    const token = issueToken(payload, expiresIn);
    return {
        accessToken: token,
        expires: expiresIn,
    };
}

export function issueJwt({ userId, role }: UserArgs) {
    const payload: JwtPayload = {
        sub: userId,
        iat: currentTimestampInSecond(),
        role,
    };

    // Expires in 15 minutes
    const expiresIn = 15 * 60;

    const token = issueToken(payload, expiresIn);

    return {
        accessToken: token,
        refreshToken: issueRefreshToken(userId),
        expires: expiresIn,
        tokenType: 'Bearer',
    };
}
