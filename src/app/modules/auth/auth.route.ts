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
    this
    .router
    .route('/login')
    .post(
      validateRequest(AuthValidation.createLoginZodSchema),
      this.authController.loginUser
    );

    // POST /forget-password
    this
    .router
    .route('/forget-password')
    .post(
      validateRequest(AuthValidation.createForgetPasswordZodSchema),
      this.authController.forgetPassword
    );

    // POST /verify-email
    this
    .router
    .route('/verify-email')
    .post(
      validateRequest(AuthValidation.createVerifyEmailZodSchema),
      this.authController.verifyEmail
    );

    // POST /reset-password
    this
    .router
    .route('/reset-password')
    .post(
      validateRequest(AuthValidation.createResetPasswordZodSchema),
      this.authController.resetPassword
    );

    // POST /refresh-token
    this
    .router
    .route('/refresh-token')
    .post(
      validateRequest(AuthValidation.createRefreshToken),
      this.authController.refreshAccessToken
    );

    // POST /change-password
    this
    .router
    .route('/change-password')
    .post(
      auth(USER_ROLES.ADMIN, USER_ROLES.USER),
      validateRequest(AuthValidation.createChangePasswordZodSchema),
      this.authController.changePassword
    );
  }
}

export default new AuthRoutes().router;