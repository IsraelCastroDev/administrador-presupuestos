import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Expense from "./Expense";
import User from "./User";

// generar la tabla
@Table({
  tableName: "budgets",
})

// modelo
class Budget extends Model {
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

  @HasMany(() => Expense, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare expenses: Expense[];

  // clave foránea de User con nombre userId
  @ForeignKey(() => User)
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}

export default Budget;
