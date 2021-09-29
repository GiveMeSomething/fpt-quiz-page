import 'reflect-metadata';
import { Container } from 'typedi';
import AuthController from '../services/auth/auth.controller';

const authController = Container.get(AuthController);

const route = (app: any) => {
    app.use('/auth', authController.route());
};

export default route;
