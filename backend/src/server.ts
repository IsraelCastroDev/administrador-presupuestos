import express from "express";
import morgan from "morgan";
import budgetRoutes from "./routes/budget.routes";

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use("/api/budgets", budgetRoutes);

export default server;
