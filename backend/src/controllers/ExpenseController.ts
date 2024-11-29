import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
  static create = async (req: Request, res: Response) => {
    try {
      const { budgetId } = req.params;
      const { name, amount } = req.body;

      await Expense.create({ name, amount, budgetId });

      res.status(200).json({ message: "Gasto creado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al crear el gasto" });
    }
  };

  static getAll = async (req: Request, res: Response) => {
    try {
      const { budgetId } = req.params;

      const expenses = await Expense.findAll({
        where: {
          budgetId,
        },
      });

      res.status(200).json(expenses);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los gastos" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { expense } = req;

    res.status(200).json(expense);
  };

  static updateById = async (req: Request, res: Response) => {
    const { expense } = req;

    await expense!.update(req.body);

    res.status(200).json({ message: "Gasto actualizado correctamente" });
  };

  static deleteById = async (req: Request, res: Response) => {
    try {
      const { expense } = req;

      await expense!.destroy();

      res.status(200).json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los gastos" });
    }
  };
}
