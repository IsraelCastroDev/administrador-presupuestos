import { Router } from "express";
import { AuthController } from "../controllers";
import {
  handleValidateUserAccountExists,
  handleValidateUserId,
  handleValidateUserInput,
} from "../middlewares/user-middleware";
import { handleInputErrors } from "../middlewares/validation";
import { body } from "express-validator";
import { limiter } from "../config/limiter";

const authRoutes = Router();

// agregando el limitador de request a todos los endpoints de auth
authRoutes.use(limiter);

authRoutes.param("userId", handleValidateUserId);

authRoutes.post(
  "/create-account",
  handleValidateUserInput,
  handleInputErrors,
  handleValidateUserAccountExists,
  AuthController.create
);

authRoutes.post(
  "/confirm-account",
  body("token")
    .notEmpty()
    .withMessage("Token no válido")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.confirmAccount
);

authRoutes.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email es obligatorio")
    .isEmail()
    .withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña es obligatoria"),
  AuthController.login
);

authRoutes.get("/users", AuthController.getAll);

export { authRoutes };
