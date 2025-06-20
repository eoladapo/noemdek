import HTTP_STATUS from 'http-status-codes';
import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { CustomError, IErrorResponse } from '@noemdek/utils/helpers/error-handler';
import applicationRoutes from './routes';
// import { IAuthPayload } from './interfaces/auth.interface';
// import { verify } from 'jsonwebtoken';
// import { config } from './config';

const SERVER_PORT = 3000;

export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startHttpServer(this.app);
  }

  private securityMiddleware(app: Application) {
    this.app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      })
    );
    // app.use((req: Request, _res: Response, next: NextFunction) => {
    //   if (req.headers.authorization) {
    //     const token = req.headers.authorization.split(' ')[1];
    //     const payload: IAuthPayload = verify(token, `${config.JWT_SECRET!}`) as IAuthPayload;
    //     req.currentUser = payload;
    //   }
    //   next();
    // });
  }

  private standardMiddleware(app: Application): void {
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all(/('*')/, (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: `${req.originalUrl} not found`,
      });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      console.log(error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeError);
      }
      next();
    });
  }

  private async startHttpServer(app: Application): Promise<void> {
    try {
      app.listen(SERVER_PORT, () => {
        console.log(`HTTP server is running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      console.error('Error starting HTTP server:', error);
    }
  }
}
