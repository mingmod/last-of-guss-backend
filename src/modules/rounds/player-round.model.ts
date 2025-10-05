import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Round } from "./round.model";
import { User } from "../users/user.model";

@Table({
  tableName: "player_round_stats",
  timestamps: true,
  indexes: [
    {
      unique: true,
      name: "unique_round_user",
      fields: ["roundId", "userId"],
    },
  ],
})
export class PlayerRound extends Model<
  PlayerRound,
  { roundId: string; userId: string; taps?: number; points?: number }
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Round)
  @Column({ type: DataType.UUID, allowNull: false })
  roundId!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  taps!: number;

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  points!: number;

  // Associations
  @BelongsTo(() => Round, "roundId")
  round!: Round;

  @BelongsTo(() => User, "userId")
  user!: User;
}
