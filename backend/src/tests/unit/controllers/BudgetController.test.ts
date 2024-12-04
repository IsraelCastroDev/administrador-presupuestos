import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers";
import Budget from "../../models/Budget";
import Expense from "../../models/Expense";

jest.mock("../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

describe("BudgetController.getAll", () => {
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(
        (budget) => budget.userId === options.where.userId
      );
      return Promise.resolve(updatedBudgets);
    });
  });

  it("should retrieve 2 budgtes for user with id 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 1 },
    });

    const res = createResponse();

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(2);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it("should retrieve 1 budgtes for user with id 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 2 },
    });

    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(1);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it("should retrieve 0 budgtes for user with id 10", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: { id: 10 },
    });

    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();

    expect(data).toHaveLength(0);
    expect(res.statusCode).toBe(200);
    expect(res.statusCode).not.toBe(404);
  });

  it("should handle errors when fetching budgets", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
    });

    const res = createResponse();

    (Budget.findAll as jest.Mock).mockRejectedValue(new Error());

    await BudgetController.getAll(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      error: "Ocurrió un error al obtener los presupuestos",
    });
  });
});

describe("BudgetController.create", () => {
  // simulando la instancia del modelo
  const mockBudget = {
    save: jest.fn().mockResolvedValue(true),
  };

  (Budget.create as jest.Mock).mockResolvedValue(mockBudget);

  // validando la creacion de un presupuesto
  it("should create a new budget and respond with statusCode 201", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      body: { name: "Presupuesto prueba", amount: 2000 },
      user: { id: 1 },
    });

    const res = createResponse();

    await BudgetController.create(req, res);

    // cubriendo tests
    expect(res.statusCode).toBe(201);
    expect(res.statusCode).not.toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      message: "Presupuesto creado correctamente",
    });

    expect(mockBudget.save).toHaveBeenCalled();
    expect(mockBudget.save).toHaveBeenCalledTimes(1);
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });

  it("shoud handle budget creation error", async () => {
    // simlando la instancia del modelo Budget
    const mockBudget = {
      save: jest.fn(),
    };

    // forzando error
    (Budget.create as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
    });

    const res = createResponse();

    await BudgetController.create(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      error: "Ocurrió un error al crear el presupuesto",
    });

    expect(mockBudget.save).not.toHaveBeenCalled();
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });
});

describe("BudgetController.getById", () => {
  // simular la busqueda que hace la BD
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.filter((budget) => budget.id === id)[0];
      return Promise.resolve(budget);
    });
  });

  it("should return a budget with id 1 and 3 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:id",
      budget: { id: 1 },
    });

    const res = createResponse();

    await BudgetController.getById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(3);

    expect(Budget.findByPk).toHaveBeenCalled();
    expect(Budget.findByPk).toHaveBeenCalledTimes(1);
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget!.id, {
      include: [Expense],
    });
  });

  it("should return a budget with id 2 and 2 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:id",
      budget: { id: 2 },
    });

    const res = createResponse();

    await BudgetController.getById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(2);
  });

  it("should return a budget with id 3 and 0 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/:id",
      budget: { id: 3 },
    });

    const res = createResponse();

    await BudgetController.getById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(0);
  });
});

describe("BudgetController.updateById", () => {
  it("should update the budget and return a succes message", async () => {
    const budgetMock = {
      update: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/:id",
      budget: budgetMock,
      body: { name: "presupuesto actualiazado", amount: 2000 },
    });

    const res = createResponse();

    await BudgetController.updateById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(budgetMock.update).toHaveBeenCalled();
    expect(budgetMock.update).toHaveBeenCalledTimes(1);
    expect(budgetMock.update).toHaveBeenCalledWith(req.body);
    expect(data).toStrictEqual({
      message: "Presupuesto actualizado correctamente",
    });
  });
});

describe("BudgetController.deleteById", () => {
  it("should delete the budget and return a succes message", async () => {
    const mockBudget = {
      destroy: jest.fn().mockResolvedValue(true),
    };

    const req = createRequest({
      method: "DELETE",
      url: "/api/budgets/:id",
      budget: mockBudget,
    });

    const res = createResponse();

    await BudgetController.deleteById(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(data).toStrictEqual({
      message: "Presupuesto eliminado correctamente",
    });
    expect(mockBudget.destroy).toHaveBeenCalled();
    expect(mockBudget.destroy).toHaveBeenCalledTimes(1);
  });
});
