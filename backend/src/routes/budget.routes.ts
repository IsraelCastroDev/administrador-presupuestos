import { Router } from "express";
import { BudgetController, ExpenseController } from "../controllers";
import { handleInputErrors } from "../middlewares/validation";
import {
  handleBudgetExists,
  handleValidateBudgetInput,
  handleValidateBudgetId,
} from "../middlewares/budget-middleware";
import {
  handleValidateExpenseExists,
  handleValidateExpenseId,
  handleValidateExpenseInput,
} from "../middlewares/expense-middleware";

const router = Router();

// llamar al middleware automáticamente cuando se valida el parámetro 'budgetId'
router.param("budgetId", handleValidateBudgetId);
router.param("budgetId", handleBudgetExists);

// llamar al middleware automáticamente cuando se valida el parámetro 'expenseId'
router.param("expenseId", handleValidateExpenseId);
router.param("expenseId", handleValidateExpenseExists);

/*------------------ Endpoints para presupuestos ---------------------------*/
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

/*------------------ Endpoints para gastos ---------------------------*/
router.get("/:budgetId/expenses", ExpenseController.getAll);

router.post(
  "/:budgetId/expenses",
  handleValidateExpenseInput,
  handleInputErrors,
  ExpenseController.create
);

router.get("/:budgetId/expenses/:expenseId", ExpenseController.getById);

router.put(
  "/:budgetId/expenses/:expenseId",
  handleValidateExpenseInput,
  handleInputErrors,
  ExpenseController.updateById
);

router.delete("/:budgetId/expenses/:expenseId", ExpenseController.deleteById);

export default router;
