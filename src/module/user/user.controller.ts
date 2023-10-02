import { Controller, Get, HttpStatus } from '@nestjs/common';

import { ResponseDto } from '@dto/response';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return new ResponseDto(HttpStatus.OK, await this.userService.getUsersAndCount());
  }
}
