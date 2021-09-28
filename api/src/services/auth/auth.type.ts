export type AuthResponse = {
    accessToken: string;
};

export type JwtPayload = {
    email: string;
    sub: string;
    role: string;
};
