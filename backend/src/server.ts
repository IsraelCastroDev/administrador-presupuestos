import express from "express";
import morgan from "morgan";
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

const server = express();

server.use(morgan("dev"));
server.use(express.json());

export default server;
