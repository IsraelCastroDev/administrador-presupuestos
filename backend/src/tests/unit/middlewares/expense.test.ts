import { createRequest, createResponse } from "node-mocks-http";
import { handleValidateExpenseExists } from "../../../middlewares/expense-middleware";
import Expense from "../../../models/Expense";
import { budgets } from "../../mocks/budgets";

jest.mock("../../../models/Expense", () => ({
  findByPk: jest.fn(),
}));

describe("expenese - handleValidateExpenseExists", () => {
  it("should call next() and set req.expense when the expense exists", async () => {
    (Expense.findByPk as jest.Mock).mockResolvedValue(budgets[0].expenses[0]);

    const req = createRequest({
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      params: { expenseId: 1 },
    });

    const res = createResponse();
    const next = jest.fn();

    await handleValidateExpenseExists(req, res, next);

    const { expenseId } = req.params;

    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(Expense.findByPk).toHaveBeenCalledWith(expenseId);
  });

  it("should respond with 404 and not call next() when the expense does not exist", async () => {
    (Expense.findByPk as jest.Mock).mockResolvedValue(null);

    const req = createRequest({
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      params: { expenseId: 1 },
    });

    const res = createResponse();
    const next = jest.fn();

    await handleValidateExpenseExists(req, res, next);
    const { expenseId } = req.params;

    const data = res._getJSONData();

    expect(res.statusCode).toBe(404);
    expect(data).toStrictEqual({ error: "Gasto no encontrado" });
    expect(next).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledTimes(1);
    expect(Expense.findByPk).toHaveBeenCalledWith(expenseId);
  });

  it("should respond with 500 and not call next() when an error occurs while finding the expense", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      params: { expenseId: 1 },
    });

    const res = createResponse();
    const next = jest.fn();

    await handleValidateExpenseExists(req, res, next);
    const { expenseId } = req.params;

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toStrictEqual({ error: "Ocurrió un error inesperado" });
    expect(next).not.toHaveBeenCalled();
    expect(Expense.findByPk).toHaveBeenCalled();
    expect(Expense.findByPk).toHaveBeenCalledWith(expenseId);
  });
});
