import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { Expense } from "../models";

export const handleValidateExpenseId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("expenseId")
    .isInt()
    .withMessage("Id no válido")
    .custom((id: number) => id > 0)
    .withMessage("Id no válido")
    .run(req);

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  next();
};

export const handleValidateExpenseExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      res.status(404).json({ error: "Gasto no encontrado" });
      return;
    }

    req.expense = expense;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ocurrió un error inesperado" });
  }
};

export const handleValidateExpenseInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await body("name").notEmpty().withMessage("El nombre es requerido").run(req),
    await body("amount")
      .notEmpty()
      .withMessage("El monto del presupuesto es requerido")
      .isNumeric()
      .withMessage("Cantidad no válida")
      .custom((amount: number) => amount >= 0)
      .withMessage("La cantidad debe ser mayor a 0")
      .run(req);

  next();
};
