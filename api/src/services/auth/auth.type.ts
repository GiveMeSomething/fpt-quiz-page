export type RefreshTokenResponse = {
    accessToken: string;
    expires: number;
};

export type JwtResponse = {
    accessToken: string;
    refreshToken: RefreshTokenResponse;
    tokenType?: string;
    expires: number;
};

export type JwtPayload = {
    sub: string;
    role: string;
    iat: number;
};

export type RefreshTokenPayload = {
    sub: string;
    iat: number;
};
