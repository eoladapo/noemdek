import { config } from '@noemdek/config';
import { IAuthPayload, IAuthResponse, ILoginRequest, IRegisterRequest } from '@noemdek/interfaces/auth.interface';
import { IUser } from '@noemdek/interfaces/user.interface';
import { UserModel } from '@noemdek/models/user.schema';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@noemdek/utils/helpers/error-handler';
import { sign, verify } from 'jsonwebtoken';

export class AuthService {
  public async signup(userData: IRegisterRequest) {
    // check if user already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    // create user
    const user = await UserModel.create(userData);
    const token = await this.generateTokens(user);
    return {
      user,
      ...token,
    };
  }

  public async login(loginData: ILoginRequest): Promise<IAuthResponse> {
    // Find user
    const user = await UserModel.findOne({ email: loginData.email });
    if (!user) {
      throw new NotFoundError('Invalid credentials');
    }

    // verify password
    const isPasswordCorrect = await user.comparePassword(loginData.password);
    if (!isPasswordCorrect) {
      throw new NotAuthorizedError('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  public async refreshToken(refreshToken: string): Promise<IAuthResponse> {
    // verify refresh token
    const decoded = verify(refreshToken, config.JWT_SECRET!) as IAuthPayload;
    if (!decoded) {
      throw new NotAuthorizedError('Invalid refresh token');
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new NotAuthorizedError('User not found');
    }

    const tokens = await this.generateTokens(user);

    return {
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  private async generateTokens(user: IUser): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: IAuthPayload = {
      userId: user._id ? user._id.toString() : '',
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = sign(payload, config.JWT_SECRET!, { expiresIn: '1d' });
    const refreshToken = sign(payload, config.JWT_SECRET!, { expiresIn: '4d' });
    return { accessToken, refreshToken };
  }
}
