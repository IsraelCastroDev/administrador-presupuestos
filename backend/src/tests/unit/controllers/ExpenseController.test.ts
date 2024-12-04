import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { ExpenseController } from "../../../controllers";
import { budgets } from "../../mocks/budgets";

jest.mock("../../../models/Expense", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
}));

describe("ExpenseController.create", () => {
  it("should successfully create a new expense", async () => {
    (Expense.create as jest.Mock).mockResolvedValue(true);

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      params: { budgetId: 1 },
      body: { name: "nuevo gasto", amount: 2000 },
    });
    const res = createResponse();

    await ExpenseController.create(req, res);

    const { budgetId } = req.params;
    const { name, amount } = req.body;

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toStrictEqual({ message: "Gasto creado correctamente" });
    expect(Expense.create).toHaveBeenCalled();
    expect(Expense.create).toHaveBeenCalledTimes(1);
    expect(Expense.create).toHaveBeenCalledWith({ name, amount, budgetId });
  });

  it("should return a 500 status code if an error occurs", async () => {
    (Expense.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budgets/:budgetId/expenses",
      params: { budgetId: 1 },
      body: { name: "nuevo gasto", amount: 2000 },
    });

    const res = createResponse();

    await ExpenseController.create(req, res);

    const { budgetId } = req.params;
    const { name, amount } = req.body;

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toStrictEqual({ error: "Error al crear el gasto" });
    expect(Expense.create).toHaveBeenCalledWith({ name, amount, budgetId });
  });
});

describe("ExpenseController.getById", () => {
  it("should return the requested expense by ID", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: budgets[0].expenses[0],
    });

    const res = createResponse();

    await ExpenseController.getById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toStrictEqual(budgets[0].expenses[0]);
  });
});

describe("ExpenseController.updateById", () => {
  const expenseMock = {
    update: jest.fn(),
  };

  it("should successfully update an expense with the provided data", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: expenseMock,
      body: { name: "gasto actualiado", amount: 2000 },
    });

    const res = createResponse();

    await ExpenseController.updateById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toStrictEqual({ message: "Gasto actualizado correctamente" });
    expect(expenseMock.update).toHaveBeenCalled();
    expect(expenseMock.update).toHaveBeenCalledTimes(1);
    expect(expenseMock.update).toHaveBeenCalledWith(req.body);
  });
});

describe("ExpenseController.getAll", () => {
  beforeEach(() => {
    (Expense.findAll as jest.Mock).mockReset();
    (Expense.findAll as jest.Mock).mockImplementation((options) => {
      const updatedExpenses = budgets[0].expenses.filter(
        (expense) => expense.budgetId === options.where.budgetId
      );
      return Promise.resolve(updatedExpenses);
    });
  });

  it("should fetch all expenses for a given budget ID successfully", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      params: { budgetId: 1 },
    });

    const res = createResponse();

    await ExpenseController.getAll(req, res);
    const { budgetId } = req.params;

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toHaveLength(3);
    expect(Expense.findAll).toHaveBeenCalled();
    expect(Expense.findAll).toHaveBeenCalledTimes(1);
    expect(Expense.findAll).toHaveBeenCalledWith({
      where: {
        budgetId,
      },
    });
  });

  it("should return a 500 status code when an error occurs while fetching expenses", async () => {
    (Expense.findAll as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      params: { budgetId: 1 },
    });

    const res = createResponse();

    await ExpenseController.getAll(req, res);
    const { budgetId } = req.params;

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toStrictEqual({ error: "Error al obtener los gastos" });
    expect(Expense.findAll).toHaveBeenCalledWith({
      where: {
        budgetId,
      },
    });
  });
});

describe("ExpenseController.deleteById", () => {
  it("should delete an expense successfully and return a success message", async () => {
    (Expense.destroy as jest.Mock).mockResolvedValue(true);

    const mockExpense = {
      destroy: jest.fn(),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: mockExpense,
    });

    const res = createResponse();

    await ExpenseController.deleteById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toStrictEqual({ message: "Gasto eliminado correctamente" });
    expect(mockExpense.destroy).toHaveBeenCalled();
    expect(mockExpense.destroy).toHaveBeenCalledTimes(1);
  });

  it("should return a 500 status code when an error occurs during deletion", async () => {
    const mockExpense = {
      destroy: jest.fn().mockRejectedValue(new Error()),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:budgetId/expenses/:expenseId",
      expense: mockExpense,
    });

    const res = createResponse();

    await ExpenseController.deleteById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(500);
    expect(data).toStrictEqual({ error: "Error al obtener los gastos" });
    expect(mockExpense.destroy).toHaveBeenCalled();
  });
});
