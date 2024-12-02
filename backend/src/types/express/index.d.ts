import * as express from "express";
import Budget from "../../models/Budget";
import Expense from "../../models/Expense";
import User from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
      expense?: Expense;
      user?: User;
    }
  }
}
