export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
    expires: number | string;
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
