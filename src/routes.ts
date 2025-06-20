import { authMiddleware } from '@noemdek/utils/helpers/auth-middleware';
import { Application } from 'express';
import { authRouter } from './routes/auth.routes';
import { priceRouter } from './routes/price.routes';
import { stationRouter } from './routes/station.routes';

export default (app: Application) => {
  const routes = () => {
    app.use('/api/auth', authRouter);
    app.use('/api/prices', authMiddleware.verifyUser, priceRouter);
    app.use('/api/stations', authMiddleware.verifyUser, stationRouter);
  };
  routes();
};
