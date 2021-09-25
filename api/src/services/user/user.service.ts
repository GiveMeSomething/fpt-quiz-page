import 'reflect-metadata';
import { Service } from 'typedi';
import { User } from '../../models/user';
import UserRepository from './user.repository';
import { BadRequestException } from '../../utils/errorHandler/commonError';

// Compose repository functions to provide services
@Service()
export default class UserService {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async create(user: User) {
        // Check if user has already created (with input email)
        const oldUser = await this.userRepository.findByEmail(user.email);
        if (oldUser) {
            throw BadRequestException('User existed. Please login.');
        }

        // Create new user
        const newUser = await this.userRepository.create(user);

        // Send verification email (optional)

        // Return created user for other process
        return newUser;
    }
}
