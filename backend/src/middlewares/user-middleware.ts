import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import User from "../models/User";

export const handleValidateUserInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("Nombre inválido")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener mínimo 3 caracteres")
    .run(req);
  await body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 5 })
    .withMessage("La contraseña debe tener mínimo 5 caracteres")
    .run(req);
  await body("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("Correo electrónico inválido")
    .run(req);

  next();
};

export const handleValidateUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne(email);

    if (user) {
      res
        .status(404)
        .json({ error: "El email ya está registrado, inicia sesión" });
      return;
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la cuenta" });
  }
};
