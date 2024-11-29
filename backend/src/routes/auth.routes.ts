import { Router } from "express";
import { AuthController } from "../controllers";
import {
  handleValidateAccountExists,
  handleValidateUserExists,
  handleValidateUserId,
  handleValidateUserInput,
} from "../middlewares/user-middleware";
import { handleInputErrors } from "../middlewares/validation";

const authRoutes = Router();

authRoutes.param("userId", handleValidateUserId);

authRoutes.post(
  "/create-account",
  handleValidateUserInput,
  handleInputErrors,
  handleValidateAccountExists,
  AuthController.create
);

authRoutes.get("/users", AuthController.getAll);

export { authRoutes };
