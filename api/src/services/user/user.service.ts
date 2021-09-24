import 'reflect-metadata';
import { Service } from 'typedi';
import { IUser } from '../../models/user';
import UserRepository from './user.repository';

@Service()
export default class UserService {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async create(user: IUser) {
        const result = await this.userRepository.create(user);
        return result;
    }
}
