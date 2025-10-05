import {
  Controller,
  Post,
  Param,
  Body,
  BadRequestException,
  ForbiddenException,
  Get,
} from "@nestjs/common";
import { RoundsService } from "./rounds.service";
import { UsersService } from "../users/users.service";

class CreateRoundDto {
  startAt?: string;
  durationMinutes?: number;
  createdBy?: string;
}

@Controller("rounds")
export class RoundsController {
  constructor(
    private roundsService: RoundsService,
    private usersService: UsersService
  ) {}

  @Post()
  async create(@Body() dto: CreateRoundDto) {
    if (!dto.createdBy) throw new BadRequestException("createdBy required");

    // fetch user to check role
    const user = await this.usersService.findById(dto.createdBy);
    if (!user) throw new BadRequestException("User not found");
    if (user.role !== "admin") throw new ForbiddenException();

    const startAt = dto.startAt ? new Date(dto.startAt) : undefined;
    const r = await this.roundsService.createRound(
      startAt,
      dto.durationMinutes
    );
    return r;
  }

  @Post(":id/tap")
  async tap(@Param("id") id: string, @Body() body: { userId: string }) {
    if (!body.userId) throw new BadRequestException("userId required");
    const user = await this.usersService.findById(body.userId);
    if (!user) throw new BadRequestException("User not found");
    if (user.role !== "survivor") return { points: 0 };
    const result = await this.roundsService.tap(id, user);
    return result;
  }

  @Get(":id")
  async getRound(@Param("id") id: string) {
    return this.roundsService.getRoundById(id);
  }

  @Get()
  async list() {
    return this.roundsService.getAllRounds();
  }
}
