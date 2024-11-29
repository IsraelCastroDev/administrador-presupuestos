import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  Table,
  Unique,
} from "sequelize-typescript";
import Budget from "./Budget";

// generar tabla
@Table({
  tableName: "users",
})

// creando modelo
class User extends Model {
  @AllowNull(false)
  @Column({ type: DataType.STRING(100) })
  declare name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(60) })
  declare password: string;

  @Unique(true)
  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare email: string;

  @Column({ type: DataType.STRING(6) })
  declare token: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare confirmed: boolean;

  // relacion
  @HasMany(() => Budget, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  declare budgets: Budget[];
}

export default User;
