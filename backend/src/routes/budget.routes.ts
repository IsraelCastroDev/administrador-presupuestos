import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import {
  handleBudgetExists,
  handleValidateBudgetInput,
  handleValidateBudgetId,
} from "../middlewares/budget-middleware";
import { ExpenseController } from "../controllers/ExpenseController";

const router = Router();

// llamar al middleware automáticamente cuando se valida el parámetro 'budgetId'
router.param("budgetId", handleValidateBudgetId);
router.param("budgetId", handleBudgetExists);

router.get("/", BudgetController.getAll);
router.post(
  "/",
  handleValidateBudgetInput,
  handleInputErrors,
  BudgetController.create
);

router.get("/:budgetId", BudgetController.getById);

router.put(
  "/:budgetId",
  handleValidateBudgetId,
  handleInputErrors,
  BudgetController.updateById
);

router.delete("/:budgetId", BudgetController.deleteById);

/* Endpoints para gastos */
router.get("/:budgetId/expenses", ExpenseController.getAll);
router.post("/:budgetId/expenses", ExpenseController.create);
router.get("/:budgetId/expenses/:expenseId", ExpenseController.getById);
router.put("/:budgetId/expenses/:expenseId", ExpenseController.updateById);
router.delete("/:budgetId/expenses/:expenseId", ExpenseController.deleteById);

export default router;
