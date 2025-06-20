import { AuthController } from '@noemdek/controllers/auth.controller';
import { Router } from 'express';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

export { router as authRouter };
