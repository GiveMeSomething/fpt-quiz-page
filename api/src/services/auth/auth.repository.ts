import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';

import { Model } from 'mongoose';
import { Service } from 'typedi';

import { RefreshTokenResponse } from './auth.type';
import { Undefinable } from '../../@types/app.type';
import { RefreshToken, RefreshTokenModel } from '../../models/refreshToken';

// Only write operation with database in here
// Mainly dealt with refresh token
@Service()
export default class AuthRepository {
    private readonly refreshTokenModel: Model<RefreshToken>;

    constructor() {
        this.refreshTokenModel = RefreshTokenModel;
    }

    async createRefreshToken(refreshToken: RefreshTokenResponse, userId: string): Promise<RefreshToken> {
        // iat will be default at Date.now()
        const newToken: RefreshToken = await this.refreshTokenModel.create({
            userId,
            accessToken: refreshToken.accessToken,
            expires: refreshToken.expires,
        });

        await newToken.save();

        return newToken;
    }

    async updateRefreshToken(refreshToken: RefreshTokenResponse, userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOneAndUpdate({ userId }, { $set: { ...refreshToken } }).exec();
    }

    async updateRefreshTokenFamily(accessToken: string, userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOneAndUpdate({ userId }, { $push: { family: accessToken } }).exec();
    }

    async removeRefreshTokenByUserId(userId: string): Promise<boolean> {
        const result = await this.refreshTokenModel.deleteOne({ userId });
        return result.acknowledged;
    }

    async findRefreshTokenByUserId(userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOne({ userId }).exec();
    }
}
