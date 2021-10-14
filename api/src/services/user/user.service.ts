import 'reflect-metadata'
import * as bcrypt from 'bcrypt'

import { Service } from 'typedi'

import UserRepository from './user.repository'
import { User } from '../../models/user'
import { BadRequestException } from '../../utils/errorHandler/commonError'
import { Undefinable } from '../../@types/app.type'

// Compose repository functions to provide services
@Service()
export default class UserService {
    private readonly userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async create(input: User) {
        // Check if user has already created (with input email)
        const user = await this.userRepository.findByEmail(input.email)
        if (user) {
            throw BadRequestException('User existed. Please login.')
        }

        // Create new user
        const newUser = await this.userRepository.create(input)

        // Send verification email (optional)

        // Return created user for other process
        return newUser
    }

    async findById(userId: string): Promise<Undefinable<User>> {
        return this.userRepository.findById(userId)
    }

    async findByEmail(email: string): Promise<Undefinable<User>> {
        return this.userRepository.findByEmail(email)
    }
}
