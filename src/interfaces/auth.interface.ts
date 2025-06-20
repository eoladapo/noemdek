import { IUser } from './user.interface';

declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

export interface IAuthPayload {
  userId: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  iat?: string;
}

export interface IAuthResponse {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}
