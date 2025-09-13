import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';

export class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController(); 
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /login
    this.router.post(
      '/login',
      validateRequest(AuthValidation.createLoginZodSchema),
      this.authController.loginUser
    );

    // POST /forget-password
    this.router.post(
      '/forget-password',
      validateRequest(AuthValidation.createForgetPasswordZodSchema),
      this.authController.forgetPassword
    );

    // POST /verify-email
    this.router.post(
      '/verify-email',
      validateRequest(AuthValidation.createVerifyEmailZodSchema),
      this.authController.verifyEmail
    );

    // POST /reset-password
    this.router.post(
      '/reset-password',
      validateRequest(AuthValidation.createResetPasswordZodSchema),
      this.authController.resetPassword
    );

    // POST /refresh-token
    this.router.post(
      '/refresh-token',
      validateRequest(AuthValidation.createRefreshToken),
      this.authController.refreshAccessToken
    );

    // POST /change-password
    this.router.post(
      '/change-password',
      auth(USER_ROLES.ADMIN, USER_ROLES.USER),
      validateRequest(AuthValidation.createChangePasswordZodSchema),
      this.authController.changePassword
    );
  }
}

// export singleton instance
export default new AuthRoutes().router;
