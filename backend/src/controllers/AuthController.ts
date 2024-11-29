import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils";

class AuthController {
  static getAll = async (req: Request, res: Response) => {};

  static create = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const hashedPassword = await hashPassword(password);

      await User.create({ name, email, password: hashedPassword });

      res.status(200).json({
        message: "Cuenta creada, te enviamos un email de confirmación",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al crear la cuenta" });
    }
  };

  static getById = (req: Request, res: Response) => {};

  static updateById = (req: Request, res: Response) => {};

  static deleteById = (req: Request, res: Response) => {};
}

export { AuthController };
