import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
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
    const [users, count] = await new UserQuery(this.userRepository).findUsersAndCount();

    return { count, users };
  }
}
