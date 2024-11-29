import { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        // TODO: Filtrar por usuario autenticado
      });

      res.json(budgets);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener los presupuestos" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);

      await budget.save();

      res.status(201).json({ message: "Presupuesto creado correctamente" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al crear el presupuesto" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { budget } = req;

    res.status(200).json(budget);
  };

  static updateById = async (req: Request, res: Response) => {
    const { budget } = req;
    await budget!.update(req.body);

    res.status(200).json({ message: "Presupuesto actualizado correctamente" });
  };

  static deleteById = async (req: Request, res: Response) => {
    const { budget } = req;
    await budget!.destroy();

    res.status(200).json({ message: "Presupuesto eliminado correctamente" });
  };
}
