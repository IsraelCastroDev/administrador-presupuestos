import { Router } from "express";
import { AuthController } from "../controllers";
import {
  handleValidateAccountExists,
  handleValidateUserExists,
  handleValidateUserId,
  handleValidateUserInput,
} from "../middlewares/user-middleware";
import { handleInputErrors } from "../middlewares/validation";
import { body } from "express-validator";
import { limiter } from "../config/limiter";

const authRoutes = Router();

authRoutes.param("userId", handleValidateUserId);

authRoutes.post(
  "/create-account",
  handleValidateUserInput,
  handleInputErrors,
  handleValidateAccountExists,
  AuthController.create
);

authRoutes.post(
  "/confirm-account",
  limiter,
  body("token")
    .notEmpty()
    .withMessage("Token no válido")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.confirmAccount
);

authRoutes.get("/users", AuthController.getAll);

export { authRoutes };
