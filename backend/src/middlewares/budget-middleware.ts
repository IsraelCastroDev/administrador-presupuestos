import { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget";
import { body, param, validationResult } from "express-validator";

export const handleBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetId } = req.params;

    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      res.status(404).json({ error: "Presupuesto no encontrado" });
      return;
    }

    req.budget = budget;

    next();
  } catch (error) {
    //console.log(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar el presupuesto" });
  }
};

export const handleValidateBudgetId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await param("budgetId")
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

export const handleValidateBudgetInput = async (
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

export const handleHasAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.budget!.userId !== req.user!.id) {
    res.status(401).json({ error: "Acción no válida" });
    return;
  }

  next();
};
