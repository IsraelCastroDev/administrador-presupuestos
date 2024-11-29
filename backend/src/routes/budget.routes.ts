import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middlewares/validation";
import {
  handleBudgetExists,
  handleValidateBudgetInput,
  handleValidateBudgetId,
} from "../middlewares/budget-middleware";

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

export default router;
