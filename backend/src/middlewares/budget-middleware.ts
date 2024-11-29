import { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget";
import { param, validationResult } from "express-validator";

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

export const handleValidateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("id")
    .isInt()
    .withMessage("Id no válido")
    .custom((id: number) => id > 0)
    .withMessage("Id no válido")
    .run(req);

  let errors = validationResult(req);

  if (!errors.isEmpty) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  next();
};
