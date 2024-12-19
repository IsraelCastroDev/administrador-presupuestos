import { Router } from "express";
import { BudgetController, ExpenseController } from "../controllers";
import { handleInputErrors } from "../middlewares/validation";
import {
  handleBudgetExists,
  handleValidateBudgetInput,
  handleValidateBudgetId,
  handleHasAccess,
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
budgetRoutes.param("budgetId", handleHasAccess);

// llamar al middleware automáticamente cuando se valida el parámetro 'expenseId'
budgetRoutes.param("expenseId", handleValidateExpenseId);
budgetRoutes.param("expenseId", handleValidateExpenseExists);

/*------------------ Endpoints para presupuestos ---------------------------*/
budgetRoutes.get("/", BudgetController.getAll);

/**
 * @openapi
 * /budgets:
 *   post:
 *     tags:
 *       - budgets
 *     summary: Crear un presupuesto
 *     description: Crear un presupuesto
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *               amount:
 *                 type: number
 *                 required: true
 *     responses:
 *       201:
 *         description: Presupuesto creado correctamente
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *       400:
 *         description: Error en el cuerpo de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       msg:
 *                         type: string
 *                       path:
 *                         type: string
 *                       location:
 *                         type: string
 *                   description: Lista de errores
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error al crear el presupuesto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */
budgetRoutes.post(
  "/",
  handleValidateBudgetInput,
  handleInputErrors,
  BudgetController.create
);

/**
 * @openapi
 * /budgets/:budgetId:
 *   get:
 *     tags:
 *       - budgets
 *     summary: Obtener un presupuesto
 *     description: Obtener un presupuesto por su id
 *     parameters:
 *       - in: path
 *         name: budgetId
 *         required: true
 *         description: id de presupuesto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Presupuesto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: "#/components/schemas/budget"
 *       400:
 *         description: Error en el cuerpo de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       msg:
 *                         type: string
 *                       path:
 *                         type: string
 *                       location:
 *                         type: string
 *                   description: Lista de errores
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Presupuesto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
