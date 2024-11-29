import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import Budget from "./Budget";

@Table({
  tableName: "expenses",
})
class Expense extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL,
  })
  declare amount: number;

  // lave foránea
  @ForeignKey(() => Budget)
  declare budgetId: number;

  // relación con budget
  @BelongsTo(() => Budget)
  declare budget: Budget;
}

export default Expense;
