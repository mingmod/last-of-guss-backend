import { Test, TestingModule } from "@nestjs/testing";
import { RoundsService } from "./rounds.service";
import { Round } from "./round.model";
import { PlayerRound } from "./player-round.model";
import { Sequelize } from "sequelize-typescript";
import { User } from "../users/user.model";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/sequelize";

describe("RoundsService", () => {
  let service: RoundsService;

  const mockRoundModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockPlayerRoundModel = {
    findOrCreate: jest.fn(),
  };

  const mockSequelize = {
    transaction: jest.fn(),
    literal: jest.fn(),
    QueryTypes: { UPDATE: "UPDATE" },
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoundsService,
        { provide: getModelToken(Round), useValue: mockRoundModel },
        { provide: getModelToken(PlayerRound), useValue: mockPlayerRoundModel },
        { provide: Sequelize, useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<RoundsService>(RoundsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRound", () => {
    it("should create a round with start and end times", async () => {
      const now = new Date();
      const mockRound = { id: "1", startAt: now, endAt: now, totalPoints: 0 };
      mockRoundModel.create.mockResolvedValue(mockRound);

      const r = await service.createRound();
      expect(mockRoundModel.create).toHaveBeenCalled();
      expect(r).toEqual(mockRound);
    });
  });

  describe("tap", () => {
    const roundId = "round1";
    const user = { id: "user1", username: "John", role: "survivor" } as User;

    it("should throw NotFoundException if round not found", async () => {
      mockRoundModel.findByPk.mockResolvedValue(null);
      await expect(service.tap(roundId, user)).rejects.toThrow(
        NotFoundException
      );
    });

    it("should throw BadRequestException if round not active", async () => {
      const past = new Date(Date.now() - 10000);
      const future = new Date(Date.now() - 5000);
      mockRoundModel.findByPk.mockResolvedValue({
        startAt: past,
        endAt: future,
      } as any);
      await expect(service.tap(roundId, user)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should return 0 taps/points if user is Nikita", async () => {
      const activeRound = {
        startAt: new Date(Date.now() - 1000),
        endAt: new Date(Date.now() + 10000),
      };
      const nikita = {
        id: "user2",
        username: "Никита",
        role: "nikita",
      } as User;
      mockRoundModel.findByPk.mockResolvedValue(activeRound as any);

      const result = await service.tap(roundId, nikita);
      expect(result).toEqual({ myTaps: 0, myPoints: 0 });
    });

    it("should increment taps and points for survivor", async () => {
      const activeRound = {
        startAt: new Date(Date.now() - 1000),
        endAt: new Date(Date.now() + 10000),
      };
      const txMock = {
        LOCK: { UPDATE: "UPDATE" },
      };
      mockRoundModel.findByPk.mockResolvedValue(activeRound as any);
      mockSequelize.transaction.mockImplementation(async (fn) => fn(txMock));
      mockPlayerRoundModel.findOrCreate.mockResolvedValue([{ id: "prs1" }]);
      mockSequelize.query.mockResolvedValue([
        [{ taps: "1", points: "1", delta: 1 }],
      ]);

      const result = await service.tap(roundId, user);
      expect(result).toEqual({ myTaps: 1, myPoints: 1 });
      expect(mockPlayerRoundModel.findOrCreate).toHaveBeenCalledWith({
        where: { roundId, userId: user.id },
        defaults: { roundId, userId: user.id, taps: 0, points: 0 },
        transaction: txMock,
        lock: txMock.LOCK?.UPDATE,
      });
    });
  });
});
