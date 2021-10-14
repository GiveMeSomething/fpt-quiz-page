export enum RoleEnum {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export type CurrentUserPayload = {
    email: string
    userId: string
    role: string[]
}
