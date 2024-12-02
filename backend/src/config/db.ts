import { Sequelize } from "sequelize-typescript";

export const db = new Sequelize(process.env.DATABASE_URL!, {
  models: [__dirname + "/../models/**/*"],
  logging: false,
});
