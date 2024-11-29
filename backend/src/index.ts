import "dotenv/config";
import server from "./server";
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

const PORT = process.env.PORT ?? 4000;

server.listen(PORT, () => console.log(`Server runnig on port ${PORT}`));
