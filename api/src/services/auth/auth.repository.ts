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

    async createRefreshToken(
        refreshToken: RefreshTokenResponse,
        accessToken: string,
        userId: string,
    ): Promise<RefreshToken> {
        // iat will be default at Date.now()
        const newToken: RefreshToken = await this.refreshTokenModel.create({
            userId,
            refreshToken: refreshToken.accessToken,
            expires: refreshToken.expires,
        });

        await newToken.save();

        return newToken;
    }

    async findAccessTokenFamily(accessToken: string, userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOne({ userId, family: accessToken }, { family: 1, _id: 0 }).exec();
    }

    async findCurrentAccessToken(userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOne({ userId }, { currentAccessToken: 1, _id: 0 }).exec();
    }

    async findRefreshTokenByUserId(userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOne({ userId }).exec();
    }

    async updateRefreshToken(
        refreshToken: RefreshTokenResponse,
        accessToken: string,
        userId: string,
    ): Promise<Undefinable<RefreshToken>> {
        // Get old jwt to push into family
        const currentRefreshToken = (await this.findRefreshTokenByUserId(userId))?.refreshToken;

        // Update the current active refresh token documents
        return this.refreshTokenModel.findOneAndUpdate(
            { userId },
            {
                $set: { refreshToken: refreshToken.accessToken, currentAccessToken: accessToken },
                $push: { family: currentRefreshToken },
            },
            {
                new: true,
            },
        );
    }

    async updateRefreshTokenFamily(accessToken: string, userId: string): Promise<Undefinable<RefreshToken>> {
        return this.refreshTokenModel.findOneAndUpdate({ userId }, { $push: { family: accessToken } }).exec();
    }

    async disableRefreshToken(userId: string) {
        return this.refreshTokenModel.findOneAndUpdate({ userId }, { $set: { valid: false } });
    }

    async removeRefreshTokenByUserId(userId: string): Promise<boolean> {
        const result = await this.refreshTokenModel.deleteOne({ userId });
        return result.acknowledged;
    }
}
