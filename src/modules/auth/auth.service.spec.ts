import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  let service: AuthService;

  const mockUsersService = {
    createOrValidateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe("validateOrCreateAndSign", () => {
    it("should create/validate user and return JWT", async () => {
      const mockUser = { id: "1", username: "John", role: "survivor" };
      mockUsersService.createOrValidateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue("mocked-jwt-token");

      const result = await service.validateOrCreateAndSign("John", "123");

      expect(mockUsersService.createOrValidateUser).toHaveBeenCalledWith(
        "John",
        "123"
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: "1",
        username: "John",
        role: "survivor",
      });
      expect(result).toEqual({
        accessToken: "mocked-jwt-token",
        user: { sub: "1", username: "John", role: "survivor" },
      });
    });
  });
});
