import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateOrCreateAndSign(username: string, password: string) {
    const user = await this.usersService.createOrValidateUser(
      username,
      password
    );
    const payload = { sub: user.id, username: user.username, role: user.role };
    return { accessToken: this.jwtService.sign(payload), user: payload };
  }
}
