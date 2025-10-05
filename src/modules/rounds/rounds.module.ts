import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Round } from "./round.model";
import { PlayerRound } from "./player-round.model";
import { RoundsService } from "./rounds.service";
import { RoundsController } from "./rounds.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule, SequelizeModule.forFeature([Round, PlayerRound])],
  providers: [RoundsService],
  controllers: [RoundsController],
  exports: [RoundsService],
})
export class RoundsModule {}
