import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { User } from "../modules/users/user.model";
import { Round } from "../modules/rounds/round.model";
import { PlayerRound } from "../modules/rounds/player-round.model";
import * as dotenv from "dotenv";
dotenv.config();

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 5432,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "the_last_of_guss",
  models: [User, Round, PlayerRound],
  synchronize: true,
  logging: false,
};
