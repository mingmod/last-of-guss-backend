import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Round } from "./round.model";
import { PlayerRound } from "./player-round.model";
import { User } from "../users/user.model";

@Injectable()
export class RoundsService {
  constructor(
    @InjectModel(Round) private roundModel: typeof Round,
    @InjectModel(PlayerRound) private playerRoundModel: typeof PlayerRound,
    private sequelize: Sequelize
  ) {}

  private now(): Date {
    return new Date();
  }

  async createRound(startAt?: Date, durationMinutes?: number) {
    const cooldownSec = Number(process.env.COOLDOWN_DURATION_SEC || 30);
    const roundDurationMin =
      durationMinutes ?? Number(process.env.ROUND_DURATION_MIN || 1);
    const start = startAt ?? new Date(Date.now() + cooldownSec * 1000);
    const end = new Date(start.getTime() + roundDurationMin * 60 * 1000);
    return this.roundModel.create({
      startAt: start,
      endAt: end,
      totalPoints: 0,
    });
  }

  async getRoundById(id: string) {
    const round = await this.roundModel.findByPk(id, {
      include: [
        {
          model: this.playerRoundModel,
          as: "playerStats",
          include: [
            { model: User, as: "user", attributes: ["id", "username", "role"] },
          ],
        },
      ],
    });

    if (!round) throw new NotFoundException("Round not found");

    return {
      ...round.toJSON(),
      totalPoints: Number(round.totalPoints),
      playerStats: round.playerStats.map((prs) => ({
        userId: prs.userId,
        username: prs.user?.username,
        role: prs.user?.role,
        taps: Number(prs.taps),
        points: Number(prs.points),
      })),
    };
  }

  async tap(
    roundId: string,
    user: User
  ): Promise<{ myTaps: number; myPoints: number }> {
    const round = await this.roundModel.findByPk(roundId);
    if (!round) throw new NotFoundException("Round not found");

    const now = this.now();
    if (!(now >= round.startAt && now <= round.endAt)) {
      throw new BadRequestException("Round is not active");
    }

    if (user.role === "nikita" || user.username === "Никита") {
      return { myTaps: 0, myPoints: 0 };
    }

    return await this.sequelize.transaction(async (tx) => {
      const [prs] = await this.playerRoundModel.findOrCreate({
        where: { roundId, userId: user.id },
        defaults: { roundId, userId: user.id, taps: 0, points: 0 },
        transaction: tx,
        lock: tx.LOCK.UPDATE,
      });

      const updateSql = `
        UPDATE player_round_stats
        SET taps = (taps::bigint + 1)::bigint,
            points = (points::bigint + CASE WHEN ((taps::bigint + 1) % 11 = 0) THEN 10 ELSE 1 END)::bigint
        WHERE id = :id
        RETURNING taps::text AS taps, points::text AS points,
                  (CASE WHEN ((taps::bigint + 1) % 11 = 0) THEN 10 ELSE 1 END)::int AS delta;
      `;
      const [results] = await (this.sequelize as any).query(updateSql, {
        replacements: { id: prs.id },
        transaction: tx,
        type: (this.sequelize as any).QueryTypes.UPDATE,
      });

      const row = Array.isArray(results) && results[0] ? results[0] : results;
      const newTaps = Number(row.taps);
      const newPoints = Number(row.points);
      const delta = Number(row.delta);

      const updateRoundSql = `
        UPDATE rounds
        SET total_points = (total_points::bigint + :delta)::bigint
        WHERE id = :roundId;
      `;
      await (this.sequelize as any).query(updateRoundSql, {
        replacements: { delta, roundId },
        transaction: tx,
      });

      return { myTaps: newTaps, myPoints: newPoints };
    });
  }
}
