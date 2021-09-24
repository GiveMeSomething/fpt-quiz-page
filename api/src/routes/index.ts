import 'reflect-metadata';
import { Container } from 'typedi';
import AuthRouter from './auth.route';

const authRouter: AuthRouter = Container.get(AuthRouter);

const route = (app: any) => {
    app.use('/auth', authRouter.route());
};

export default route;
