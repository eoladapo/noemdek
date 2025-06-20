import HTTP_STATUS from 'http-status-codes';
import { AuthService } from '@noemdek/services/auth.services';
import { IAuthResponse } from '@noemdek/interfaces/auth.interface';
import { Request, Response } from 'express';
import { refreshTokenSchema, signinSchema, signupSchema } from '@noemdek/schemes/auth-validation';
import { JoiRequestValidationError } from '@noemdek/utils/helpers/error-handler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      throw new JoiRequestValidationError(error.details[0].message);
    }
    const response: IAuthResponse = await this.authService.signup(req.body);
    res.status(HTTP_STATUS.CREATED).json(response);
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { error } = signinSchema.validate(req.body);
    if (error) {
      throw new JoiRequestValidationError(error.details[0].message);
    }
    const response: IAuthResponse = await this.authService.login(req.body);
    res.status(HTTP_STATUS.OK).json(response);
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { error } = refreshTokenSchema.validate(req.body);
    if (error) {
      throw new JoiRequestValidationError(error.details[0].message);
    }
    const response: IAuthResponse = await this.authService.refreshToken(req.body.refreshToken);
    res.status(HTTP_STATUS.OK).json(response);
  };
}
