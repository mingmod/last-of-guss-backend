import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../users/user.model";

@Table({ tableName: "rounds", timestamps: true })
export class Round extends Model<
  Round,
  {
    startAt: Date;
    endAt: Date;
    createdBy?: string;
    totalPoints?: number; // include this in create input
  }
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({ type: DataType.DATE, allowNull: false, field: "start_at" })
  startAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, field: "end_at" })
  endAt!: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, field: "created_by" })
  createdBy?: string;

  @Column({ type: DataType.BIGINT, defaultValue: 0, field: "total_points" })
  totalPoints!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: "created_at",
  })
  createdAt!: Date;
}
