import { Router } from "express";
import { AuthController } from "../controllers";
import {
  handleValidateUserAccountExists,
  handleValidateUserExists,
  handleValidateUserId,
  handleValidateUserInput,
} from "../middlewares/user-middleware";
import { handleInputErrors } from "../middlewares/validation";
import { body, param } from "express-validator";
import { limiter } from "../config/limiter";
import { authenticate } from "../middlewares/auth-middleware";

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
  body("token").isLength({ min: 6, max: 6 }).withMessage("Token no válido"),
  handleInputErrors,
  AuthController.confirmAccount
);

authRoutes.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña es obligatoria"),
  handleInputErrors,
  handleValidateUserExists,
  AuthController.login
);

/*---------- recuperar contraseña ---------------*/
authRoutes.post(
  "/send-token-to-reset-password",
  body("email")
    .notEmpty()
    .withMessage("Email es obligatorio")
    .isEmail()
    .withMessage("Email inválido"),
  handleInputErrors,
  handleValidateUserExists,
  AuthController.sendTokenToResetPassword
);

authRoutes.post(
  "/validate-reset-password-token",
  body("token")
    .notEmpty()
    .withMessage("Token no válido")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.validateResetPasswordToken
);

authRoutes.patch(
  "/reset-password/:token",
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener mínimo 5 caracteres"),
  param("token")
    .notEmpty()
    .withMessage("Token no válido")
    .isLength({ min: 6, max: 6 })
    .withMessage("Token no válido"),
  handleInputErrors,
  AuthController.resetPassword
);

authRoutes.get("/user", authenticate, AuthController.user);

authRoutes.patch(
  "/update-password",
  authenticate,
  body("currentPassword").notEmpty().withMessage("La contraseña es requerida"),
  body("newPassword")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener mínimo 5 caracteres"),
  handleInputErrors,
  AuthController.updateCurrentUserPassword
);

authRoutes.post(
  "/check-password",
  authenticate,
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  AuthController.checkPassword
);

authRoutes.get("/users", AuthController.getAll);

export { authRoutes };
