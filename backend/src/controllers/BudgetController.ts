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
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: "Presupuesto no encontrado" });
        return;
      }

      res.status(200).json(budget);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener el presupuesto" });
    }
  };

  static updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: "Presupuesto no encontrado" });
        return;
      }

      await budget.update(req.body);

      res
        .status(200)
        .json({ message: "Presupuesto actualizado correctamente" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrió un error al actualizar el presupuesto" });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const budget = await Budget.findByPk(id);

      if (!budget) {
        res.status(404).json({ error: "Presupuesto no encontrado" });
        return;
      }

      await budget.destroy();

      res.status(200).json({ message: "Presupuesto eliminado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Ocurrió un error al obtener el presupuesto" });
    }
  };
}
