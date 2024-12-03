import { Request, Response } from "express";
import User from "../models/User";
import {
  hashPassword,
  generateToken,
  checkPassword,
  generateJWT,
} from "../utils";
import { AuthEmail } from "../service/AuthEmail";

class AuthController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const users = await User.findAll();

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const hashedPassword = await hashPassword(password);
      const token = generateToken();

      await User.create({ name, email, password: hashedPassword, token });

      await AuthEmail.sendConfirmation({ email, name, token });

      res.status(200).json({
        message: "Cuenta creada, te enviamos un email de confirmación",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const user = await User.findOne({ where: { token } });

      if (!user) {
        res.status(401).json({ error: "Token no válido" });
        return;
      }

      user.confirmed = true;
      user.token = "";
      await user.save();

      res.status(200).json({ message: "Cuenta confirmada con éxito" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const { password } = req.body;

      // comprobar si ha confirmado su cuenta
      if (!user.confirmed) {
        res.status(403).json({ error: "La cuenta no ha sido confirmada" });
        return;
      }

      // comprobar contraseña
      const isCorrectPassword = await checkPassword(password, user.password);

      if (!isCorrectPassword) {
        res.status(401).json({ error: "Contraseña incorrecta" });
        return;
      }

      // crear token
      const jwtToken = generateJWT({ id: user.id });

      res.send(jwtToken);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static sendTokenToResetPassword = async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const token = generateToken();

      user.token = token;
      await user.save();

      await AuthEmail.sendRestartPasswordToken({
        name: user.name,
        email: user.email,
        token,
      });

      res
        .status(200)
        .json({ message: "Te enviamos el token, revisa tu correo" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static validateResetPasswordToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const user = await User.findOne({ where: { token } });

      if (!user) {
        res.status(404).json({ error: "Token no válido" });
        return;
      }

      res.status(200).json({ message: "Token válido" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({ where: { token } });

      if (!user) {
        res.status(404).json({ error: "Token no válido" });
        return;
      }

      const hashedPassword = await hashPassword(password);

      user.password = hashedPassword;
      user.token = "";
      await user.save();

      res.status(200).json({ message: "Contraseña actualizada" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static user = async (req: Request, res: Response) => {
    const user = req.user!;

    res.status(200).json(user);
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user!.id);

    if (!user) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const isCorrectPassword = await checkPassword(
      currentPassword,
      user.password
    );

    if (!isCorrectPassword) {
      res.status(401).json({ error: "La contraseña actual es incorrecta" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada" });
  };

  static getById = (req: Request, res: Response) => {};

  static updateById = (req: Request, res: Response) => {};

  static deleteById = (req: Request, res: Response) => {};
}

export { AuthController };
