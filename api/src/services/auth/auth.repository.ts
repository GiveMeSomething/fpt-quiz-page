import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';

import { Model } from 'mongoose';
import { Service } from 'typedi';

import { RefreshToken, RefreshTokenModel } from '../../models/refreshToken';
import { User } from '../../models/user';
import { RefreshTokenResponse } from './auth.type';
import { InternalServerException } from '../../utils/errorHandler/commonError';
import { Undefinable } from '../../@types/app.type';

// Only write operation with database in here
// Mainly dealt with refresh token
@Service()
export default class AuthRepository {
    private readonly refreshTokenModel: Model<RefreshToken>;

    constructor() {
        this.refreshTokenModel = RefreshTokenModel;
    }

    async create(refreshToken: RefreshTokenResponse, userId: string): Promise<RefreshToken> {
        // iat will be default at Date.now()
        const newToken: RefreshToken = await this.refreshTokenModel.create({
            userId,
            accessToken: refreshToken.accessToken,
            expires: refreshToken.expires,
        });

        await newToken.save();

        return newToken;
    }

    async removeByUserId(userId: string): Promise<RefreshToken> {
        return this.refreshTokenModel.remove({ userId });
    }

    async findByUserId(userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOne({ userId }).exec();
    }
}
