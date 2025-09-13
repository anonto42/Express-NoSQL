import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const verifyData = req.body;
    const result = await this.authService.verifyEmail(verifyData); 

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result.message ?? 'Email verified successfully',
      data: result.data,
    });
  });

  public loginUser = catchAsync(async (req: Request, res: Response) => {
    const loginData = req.body;
    const result = await this.authService.loginUser(loginData); 

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User logged in successfully.',
      data: result,
    });
  });

  public refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Access token refreshed successfully.',
      data: result,
    });
  });

  public forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const email = req.body.email;
    await this.authService.forgetPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Please check your email. We have sent you a one-time passcode (OTP).',
    });
  });

  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const resetData = req.body;
    await this.authService.resetPassword(resetData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Your password has been successfully reset.',
    });
  });

  public changePassword = catchAsync(async (req: Request | any, res: Response) => {
    const user = req.user;
    const passwordData = req.body;
    await this.authService.changePassword(user, passwordData); 

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Your password has been successfully changed',
    });
  });
}
