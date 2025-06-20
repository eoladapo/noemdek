import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '@noemdek/config';
import { IAuthPayload } from '@noemdek/interfaces/auth.interface';
import { NotAuthorizedError } from './error-handler';

export class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const payload: IAuthPayload = verify(token, `${config.JWT_SECRET!}`) as IAuthPayload;
        req.currentUser = payload;
      }
    } catch (error) {
      throw new NotAuthorizedError('Token is invalid, Please login again.');
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route.');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
