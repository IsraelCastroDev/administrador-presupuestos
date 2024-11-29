import { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget";

export const handleBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const budget = await Budget.findByPk(id);

  if (!budget) {
    res.status(404).json({ error: "Presupuesto no encontrado" });
    return;
  }

  req.budget = budget;

  next();
};
