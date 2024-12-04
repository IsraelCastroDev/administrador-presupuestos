import express from "express";
import morgan from "morgan";
import { budgetRoutes, authRoutes } from "./routes";

import { db } from "./config/db";

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log("Conexión exitosa a la Base de Datos");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

const server = express();

server.use(morgan("dev"));
server.use(express.json());

server.use("/api/budgets", budgetRoutes);
server.use("/api/auth", authRoutes);
//test
server.use("/", (req, res) => {
  res.send("toko ok");
});

export default server;
