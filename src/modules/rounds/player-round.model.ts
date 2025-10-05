import { Table, Column, Model, DataType } from "sequelize-typescript";

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

  @Column({ type: DataType.UUID, allowNull: false })
  roundId!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  taps!: number; // number type

  @Column({ type: DataType.BIGINT, defaultValue: 0 })
  points!: number; // number type
}
