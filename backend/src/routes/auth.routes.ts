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

/**
 * @openapi
 * /auth/create-account:
 *   post:
 *     tags:
 *       - auth
 *     summary: Crear un nuevo usuario
 *     description: Permite crear un nuevo usuario
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/createUserSchema"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error al crear la cuenta
 */
authRoutes.post(
  "/create-account",
  handleValidateUserInput,
  handleInputErrors,
  handleValidateUserAccountExists,
  AuthController.create
);

/**
 * @openapi
 * /auth/confirm-account:
 *   post:
 *     tags:
 *       - auth
 *     summary: Confirmar cuenta
 *     description: Confirmar cuenta mediante token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cuenta confirmada exitosamente
 *       400:
 *         description: Errores en el cuerpo de solicitud
 *       500:
 *         description: Error al confirmar la cuenta
 */
authRoutes.post(
  "/confirm-account",
  body("token").isLength({ min: 6, max: 6 }).withMessage("Token no válido"),
  handleInputErrors,
  AuthController.confirmAccount
);

/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *      - auth
 *    summary: Iniciar sesión
 *    description: Iniciar sesión con email registrado
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/loginUser"
 *    responses:
 *      200:
 *        description: Inicio de sesión exitoso
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: Token de autenticación para el usuario que inició sesión
 *      400:
 *        description: Errores en el cuerpo de la solicitud
 *      500:
 *        description: Error al iniciar sesión
 */
authRoutes.post(
  "/login",
  body("email").isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña es obligatoria"),
  handleInputErrors,
  handleValidateUserExists,
  AuthController.login
);

/*---------- recuperar contraseña ---------------*/

/**
 * @openapi
 * /auth/send-token-to-reset-password:
 *  post:
 *    tags:
 *      - auth
 *    summary: Enviar token para recuperar contraseña
 *    description: Envío de token para verificar el acceso para reestablecer contraseña
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *                desciption: token enviado al solicitar el reestablecimiento de contraseña
 *    responses:
 *      200:
 *        description: Token enviado exitosamente al email
 *      400:
 *        description: Errores en el cuerpo de la solicitud
 *      500:
 *        description: Error al enviar el token
 */
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

/**
 * @openapi
 * /auth/validate-reset-password-token:
 *  post:
 *    tags:
 *      - auth
 *    summary: Validar el token
 *    description: Validar el token enviado para otorgar el acceso a reestablecer la contraseña
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: El token es válido
 *      400:
 *        description: Error en el cuerpo de la solicitud
 *      500:
 *        description: Error al validar el token
 */
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

/**
 * @openapi
 * /auth/reset-password/:token:
 *  patch:
 *    tags:
 *      - auth
 *    summary: Actualizar la contraseña mediante el token
 *    description: Actualizar la contraseña mediante token, ingregando una nueva
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        description: Token de restablecimiento de la contraseña
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        appication/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Contraseña actualizada correctamente
 *      400:
 *        description: Error en el cuerpo de la solicitud
 *      500:
 *        description: Error al actualizar contraseña
 */
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

/**
 * @openapi
 * /auth/update-password:
 *  patch:
 *    tags:
 *      - auth
 *    summary: Actualizar la contraseña estando autenticado
 *    description: Actualizar la contraseña estando autenteciado en la app, ingregando una nueva
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        description: Token de restablecimiento de la contraseña
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        appication/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Contraseña actualizada correctamente
 *      400:
 *        description: Error en el cuerpo de la solicitud
 *      500:
 *        description: Error al actualizar contraseña
 *    security:
 *      - bearerAuth: []
 */
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

/**
 * @openapi
 * /auth/check-password:
 *   post:
 *    tags:
 *      - auth
 *    summary: Verificar contraseña, paso para verificar el usuario
 *    description: Verificar contraseña cuando se requiera hacer una acción importante como eliminar un registro, se pide la contraseña como metodo de confirmación de la acción
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                required: true
 *    responses:
 *      200:
 *        description: Contraseña válida
 *      400:
 *        description: Error en el cuerpo de la solicitud
 *      500:
 *        description: Error al validar la contraseña
 *    security:
 *      - bearerAuth: []
 */
authRoutes.post(
  "/check-password",
  authenticate,
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  AuthController.checkPassword
);

authRoutes.get("/users", AuthController.getAll);

export { authRoutes };
