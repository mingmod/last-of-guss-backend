import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;

  const mockAuthService = {
    validateOrCreateAndSign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("login", () => {
    it("should call authService and return token and user", async () => {
      const mockResponse = {
        accessToken: "token",
        user: { sub: "1", username: "John", role: "survivor" },
      };
      mockAuthService.validateOrCreateAndSign.mockResolvedValue(mockResponse);

      const result = await controller.login({
        username: "John",
        password: "123",
      });
      expect(mockAuthService.validateOrCreateAndSign).toHaveBeenCalledWith(
        "John",
        "123"
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
