import { QueryInterface, DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("taps", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    round_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "rounds", key: "id" },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("now()"),
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("taps");
}
