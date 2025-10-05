import { QueryInterface, DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`
    CREATE TYPE role_enum AS ENUM ('survivor', 'admin', 'nikita');
  `);

  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: "role_enum",
      allowNull: false,
      defaultValue: "survivor",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("now()"),
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("users");
  await queryInterface.sequelize.query(`DROP TYPE role_enum;`);
}
