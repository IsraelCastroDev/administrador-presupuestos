import express from "express";
import morgan from "morgan";
import { budgetRoutes, authRoutes } from "./routes";

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use("/api/budgets", budgetRoutes);
server.use("/api/auth", authRoutes);

export default server;
