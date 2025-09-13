import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // POST /users
  public createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.userService.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: result?.statusCode || StatusCodes.CREATED,
      message:
        result?.message || "User created successfully. Please verify your email.",
      data: result,
    });
  });

  // GET /users/profile
  public getUserProfile = catchAsync(async (req: Request | any, res: Response) => {
    const user = req.user; // populated from auth middleware
    const result = await this.userService.getUserProfile(user);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User profile retrieved successfully",
      data: result,
    });
  });

  // PUT /users/profile
  public updateProfile = catchAsync(async (req: Request | any, res: Response) => {
    const user = req.user;
    const result = await this.userService.updateProfile(user, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile updated successfully",
      data: result,
    });
  });
}