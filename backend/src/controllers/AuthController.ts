import { Request, Response } from "express";
import User from "../models/User";

class AuthController {
  static getAll = async (req: Request, res: Response) => {};

  static create = async (req: Request, res: Response) => {
    try {
      const user = new User(req.body);

      await user.save();

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
