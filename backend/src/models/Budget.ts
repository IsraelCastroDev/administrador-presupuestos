import { Table, Column, DataType, Model, HasMany } from "sequelize-typescript";
import { Expense } from "./Expense";

// generar la tabla
@Table({
  tableName: "budgets",
})

// modelo
class Budget extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL,
  })
  declare amount: number;

  @HasMany(() => Expense, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare expenses: Expense[];
}

export { Budget };
