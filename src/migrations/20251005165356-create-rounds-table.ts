import { QueryInterface, DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("rounds", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      references: { model: "users", key: "id" },
    },
    total_points: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("now()"),
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("rounds");
}
