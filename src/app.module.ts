import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { sequelizeConfig } from "./config/sequelize.config";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { RoundsModule } from "./modules/rounds/rounds.module";
import { User } from "./modules/users/user.model";
import { Round } from "./modules/rounds/round.model";
import { PlayerRound } from "./modules/rounds/player-round.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot(sequelizeConfig),
    SequelizeModule.forFeature([User, Round, PlayerRound]),
    UsersModule,
    AuthModule,
    RoundsModule,
  ],
})
export class AppModule {}
