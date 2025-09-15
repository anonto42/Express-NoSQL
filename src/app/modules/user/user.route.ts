import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLES } from "../../../enums/user";

export class UserRoutes {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    // GET /profile
    this
    .router
    .route("/")
    .get(
      auth(USER_ROLES.ADMIN, USER_ROLES.USER),
      this.userController.getUserProfile
    )
    .post(
      validateRequest(UserValidation.createUserZodSchema),
      this.userController.createUser
    );

    // PATCH /profile
    this
    .router
    .route("/profile")
    .patch(
      auth(USER_ROLES.ADMIN, USER_ROLES.USER),
      fileUploadHandler(),
      (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
          req.body = UserValidation.updateUserZodSchema.parse(
            JSON.parse(req.body.data)
          );
        }
        return this.userController.updateProfile(req, res, next);
      }
    );
  }
}

export default new UserRoutes().router;