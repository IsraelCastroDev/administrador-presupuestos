import {
  Table,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  Model,
} from "sequelize-typescript";

// generar la tabla
@Table({
  tableName: "budgets",
})

// modelo
class Budget extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  name: string = "";

  @Column({
    type: DataType.DECIMAL,
  })
  amount: number = 0;
}

export default Budget;
