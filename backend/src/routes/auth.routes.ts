import { Router } from "express";
import { AuthController } from "../controllers";
import { handleValidateUserInput } from "../middlewares/user-middleware";
import { handleInputErrors } from "../middlewares/validation";

const authRoutes = Router();

authRoutes.post(
  "/create-account",
  handleValidateUserInput,
  handleInputErrors,
  AuthController.create
);

export { authRoutes };
