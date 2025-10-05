import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "users", timestamps: true })
export class User extends Model<
  User,
  {
    username: string;
    passwordHash: string;
    role?: "survivor" | "admin" | "nikita";
  }
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  username!: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "password_hash" })
  passwordHash!: string;

  @Column({
    type: DataType.ENUM("survivor", "admin", "nikita"),
    defaultValue: "survivor",
  })
  role!: "survivor" | "admin" | "nikita";

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;
}
