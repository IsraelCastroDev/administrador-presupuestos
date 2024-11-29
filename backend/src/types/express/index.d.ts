import * as express from "express";
import Budget from "../../models/Budget";
import Expense from "../../models/Expense";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
      expense?: Expense;
    }
  }
}
