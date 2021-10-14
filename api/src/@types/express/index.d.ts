import { RoleEnum } from '../../services/user/user.variable';

declare namespace Express {
    export interface Request {
        user: {
            _id: string;
            email: string;
            password: string;
            role: RoleEnum;
        };
    }
}
