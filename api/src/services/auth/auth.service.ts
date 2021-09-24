import 'reflect-metadata';
import { Service } from 'typedi';
import AuthRepository from './auth.repository';

@Service()
export default class AuthService {
    private readonly authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async isDuplicate(uniqueValue: any) {
        const result = await this.authRepository.isDuplicate(uniqueValue);
        return result;
    }
}
