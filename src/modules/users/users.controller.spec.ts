import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    createOrValidateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe("login", () => {
    it("should return user data on successful login", async () => {
      const mockUser = { id: "1", username: "John", role: "survivor" };
      mockUserService.createOrValidateUser.mockResolvedValue(mockUser);

      const result = await controller.login({
        username: "John",
        password: "123",
      });
      expect(result).toEqual({ id: "1", username: "John", role: "survivor" });
    });

    it("should throw BadRequestException on invalid password", async () => {
      mockUserService.createOrValidateUser.mockRejectedValue(
        new Error("Invalid password")
      );

      await expect(
        controller.login({ username: "John", password: "wrong" })
      ).rejects.toThrow("Invalid password");
    });
  });
});
