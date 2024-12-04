import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [["createdAt", "DESC"]],
        where: { userId: req.user!.id },
      });

      res.json(budgets);
    } catch (error) {
      //console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener los presupuestos" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = await Budget.create(req.body);
      budget.userId = req.user!.id;
      await budget.save();

      res.status(201).json({ message: "Presupuesto creado correctamente" });
    } catch (error) {
      //console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al crear el presupuesto" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const budget = await Budget.findByPk(req.budget!.id, {
      include: [Expense],
    });

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
