import { Test, TestingModule } from "@nestjs/testing";
import { RoundsController } from "./rounds.controller";
import { RoundsService } from "./rounds.service";
import { UsersService } from "../users/users.service";
import { BadRequestException, ForbiddenException } from "@nestjs/common";

describe("RoundsController", () => {
  let controller: RoundsController;
  let mockRoundsService: Partial<RoundsService>;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockRoundsService = { createRound: jest.fn(), tap: jest.fn() };
    mockUsersService = { findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoundsController],
      providers: [
        { provide: RoundsService, useValue: mockRoundsService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<RoundsController>(RoundsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should throw BadRequestException if createdBy missing", async () => {
      await expect(controller.create({} as any)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw BadRequestException if user not found", async () => {
      (mockUsersService.findById as jest.Mock).mockResolvedValue(null);
      await expect(controller.create({ createdBy: "1" })).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw ForbiddenException if user not admin", async () => {
      (mockUsersService.findById as jest.Mock).mockResolvedValue({
        role: "survivor",
      });
      await expect(controller.create({ createdBy: "1" })).rejects.toThrow(
        ForbiddenException
      );
    });

    it("should call RoundsService.createRound for admin", async () => {
      const roundMock = { id: "r1" };
      (mockUsersService.findById as jest.Mock).mockResolvedValue({
        role: "admin",
      });
      (mockRoundsService.createRound as jest.Mock).mockResolvedValue(roundMock);

      const result = await controller.create({ createdBy: "1" });
      expect(result).toEqual(roundMock);
      expect(mockRoundsService.createRound).toHaveBeenCalled();
    });
  });

  describe("tap", () => {
    it("should throw BadRequestException if userId missing", async () => {
      await expect(controller.tap("r1", {} as any)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw BadRequestException if user not found", async () => {
      (mockUsersService.findById as jest.Mock).mockResolvedValue(null);
      await expect(controller.tap("r1", { userId: "1" })).rejects.toThrow(
        BadRequestException
      );
    });

    it("should return 0 points if user is Nikita", async () => {
      (mockUsersService.findById as jest.Mock).mockResolvedValue({
        role: "nikita",
      });
      const result = await controller.tap("r1", { userId: "1" });
      expect(result).toEqual({ points: 0 });
    });

    it("should call RoundsService.tap if user is survivor", async () => {
      const serviceResult = { myTaps: 1, myPoints: 1 };
      (mockUsersService.findById as jest.Mock).mockResolvedValue({
        role: "survivor",
        id: "1",
      });
      (mockRoundsService.tap as jest.Mock).mockResolvedValue(serviceResult);

      const result = await controller.tap("r1", { userId: "1" });
      expect(result).toEqual(serviceResult);
      expect(mockRoundsService.tap).toHaveBeenCalled();
    });
  });
});
