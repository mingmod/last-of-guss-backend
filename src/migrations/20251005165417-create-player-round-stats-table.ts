import { QueryInterface, DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("player_round_stats", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    round_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "rounds", key: "id" },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    taps: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    points: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  });

  await queryInterface.addConstraint("player_round_stats", {
    fields: ["round_id", "user_id"],
    type: "unique",
    name: "unique_round_user",
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("player_round_stats");
}
