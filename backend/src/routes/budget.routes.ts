import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import {
  handleBudgetExists,
  handleValidateBudgetId,
} from "../middlewares/budget-middleware";

const router = Router();

router.get("/", BudgetController.getAll);
router.post(
  "/",
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("amount")
    .notEmpty()
    .withMessage("El monto del presupuesto es requerido")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((amount: number) => amount >= 0)
    .withMessage("La cantidad debe ser mayor a 0"),
  handleInputErrors,
  BudgetController.create
);

router.get(
  "/:id",
  handleValidateBudgetId,
  handleInputErrors,
  handleBudgetExists,
  BudgetController.getById
);

router.put(
  "/:id",
  handleValidateBudgetId,
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("amount")
    .notEmpty()
    .withMessage("El monto del presupuesto es requerido")
    .isNumeric()
    .withMessage("Cantidad no válida")
    .custom((amount: number) => amount >= 0)
    .withMessage("La cantidad debe ser mayor a 0"),
  handleInputErrors,
  handleBudgetExists,
  BudgetController.updateById
);

router.delete(
  "/:id",
  handleValidateBudgetId,
  handleInputErrors,
  handleBudgetExists,
  BudgetController.deleteById
);

export default router;
