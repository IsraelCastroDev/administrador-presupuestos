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
import { authenticate } from "../middlewares/auth-middleware";

const budgetRoutes = Router();

budgetRoutes.use(authenticate);

// llamar al middleware automáticamente cuando se valida el parámetro 'budgetId'
budgetRoutes.param("budgetId", handleValidateBudgetId);
budgetRoutes.param("budgetId", handleBudgetExists);

// llamar al middleware automáticamente cuando se valida el parámetro 'expenseId'
budgetRoutes.param("expenseId", handleValidateExpenseId);
budgetRoutes.param("expenseId", handleValidateExpenseExists);

/*------------------ Endpoints para presupuestos ---------------------------*/
budgetRoutes.get("/", BudgetController.getAll);
budgetRoutes.post(
  "/",
  handleValidateBudgetInput,
  handleInputErrors,
  BudgetController.create
);

budgetRoutes.get("/:budgetId", BudgetController.getById);

budgetRoutes.put(
  "/:budgetId",
  handleValidateBudgetId,
  handleInputErrors,
  BudgetController.updateById
);

budgetRoutes.delete("/:budgetId", BudgetController.deleteById);

/*------------------ Endpoints para gastos ---------------------------*/
budgetRoutes.get("/:budgetId/expenses", ExpenseController.getAll);

budgetRoutes.post(
  "/:budgetId/expenses",
  handleValidateExpenseInput,
  handleInputErrors,
  ExpenseController.create
);

budgetRoutes.get("/:budgetId/expenses/:expenseId", ExpenseController.getById);

budgetRoutes.put(
  "/:budgetId/expenses/:expenseId",
  handleValidateExpenseInput,
  handleInputErrors,
  ExpenseController.updateById
);

budgetRoutes.delete(
  "/:budgetId/expenses/:expenseId",
  ExpenseController.deleteById
);

export { budgetRoutes };
