import { Controller, Post, Body, BadRequestException } from "@nestjs/common";
import { UsersService } from "./users.service";

class LoginDto {
  username!: string;
  password!: string;
}

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post("login")
  async login(@Body() body: LoginDto) {
    try {
      const user = await this.usersService.createOrValidateUser(
        body.username,
        body.password
      );
      return { id: user.id, username: user.username, role: user.role };
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }
  }
}
