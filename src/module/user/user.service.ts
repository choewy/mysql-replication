import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { InjectSlaveRepository } from '@core/decorators';
import { User } from '@common/entities';
import { UserQuery } from '@common/queries';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsersAndCount() {
    const [rows, count] = await new UserQuery(this.userRepository).findUsersAndCount();

    return { count, rows };
  }
}
