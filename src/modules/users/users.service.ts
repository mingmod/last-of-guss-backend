import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createOrValidateUser(username: string, password: string) {
    const found = await this.userModel.findOne({ where: { username } });
    if (!found) {
      const passwordHash = await bcrypt.hash(password, 10);
      let role: User["role"] = "survivor";
      if (username.includes("admin")) {
        role = "admin";
      } else if (username.includes("Никита") || username.includes("nikita")) {
        role = "nikita";
      }

      const created = await this.userModel.create({
        username,
        passwordHash,
        role,
      });
      return created;
    }
    const match = await bcrypt.compare(password, found.passwordHash);
    if (!match) throw new Error("Invalid password");
    return found;
  }

  async findById(id: string) {
    return this.userModel.findByPk(id);
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ where: { username } });
  }
}
