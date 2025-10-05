import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./user.model";
import * as bcrypt from "bcrypt";

describe("UsersService", () => {
  let service: UsersService;
  let mockUserModel: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: "UserRepository", useValue: mockUserModel },
        { provide: User, useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    (service as any).userModel = mockUserModel;
  });

  describe("createOrValidateUser", () => {
    it("should create a new survivor user if not exists", async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockImplementation((data: any) =>
        Promise.resolve({ ...data, id: "uuid" })
      );

      const username = "John";
      const password = "123";
      const user = await service.createOrValidateUser(username, password);

      expect(user).not.toBeNull();
      expect(user.username).toBe(username);
      expect(user.role).toBe("survivor");
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it("should create admin if username is admin", async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockImplementation((data: any) =>
        Promise.resolve({ ...data, id: "uuid" })
      );

      const user = await service.createOrValidateUser("admin", "adminpass");
      expect(user.role).toBe("admin");
    });

    it("should create nikita if username is Никита", async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockImplementation((data: any) =>
        Promise.resolve({ ...data, id: "uuid" })
      );

      const user = await service.createOrValidateUser("Никита", "123");
      expect(user.role).toBe("nikita");
    });

    it("should validate existing user with correct password", async () => {
      const passwordHash = await bcrypt.hash("123", 10);
      mockUserModel.findOne.mockResolvedValue({
        username: "John",
        passwordHash,
        role: "survivor",
      });

      const user = await service.createOrValidateUser("John", "123");
      expect(user).not.toBeNull();
      expect(user.username).toBe("John");
    });

    it("should throw error if password is wrong", async () => {
      const passwordHash = await bcrypt.hash("123", 10);
      mockUserModel.findOne.mockResolvedValue({
        username: "John",
        passwordHash,
        role: "survivor",
      });

      await expect(
        service.createOrValidateUser("John", "wrong")
      ).rejects.toThrow("Invalid password");
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      mockUserModel.findByPk.mockResolvedValue({
        id: "1",
        username: "John",
      } as User | null);
      const user = await service.findById("1");
      expect(user).not.toBeNull();
      expect(user?.username).toBe("John");
    });
  });

  describe("findByUsername", () => {
    it("should find user by username", async () => {
      mockUserModel.findOne.mockResolvedValue({
        id: "1",
        username: "John",
      } as User | null);
      const user = await service.findByUsername("John");
      expect(user).not.toBeNull();
      expect(user?.id).toBe("1");
    });
  });
});
