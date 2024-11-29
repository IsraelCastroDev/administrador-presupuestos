import { Router } from "express";
import { AuthController } from "../controllers";
import {
  handleValidateUserExists,
  handleValidateUserInput,
} from "../middlewares/user-middleware";
import { handleInputErrors } from "../middlewares/validation";

const authRoutes = Router();

authRoutes.post(
  "/create-account",
  handleValidateUserInput,
  handleInputErrors,
  handleValidateUserExists,
  AuthController.create
);

export { authRoutes };
