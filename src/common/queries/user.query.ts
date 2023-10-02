import { Repository } from 'typeorm';

import { User } from '@common/entities';

export class UserQuery {
  constructor(private readonly repo: Repository<User>) {}

  async findUsersAndCount() {
    return this.repo.findAndCount({
      select: ['id', 'createdAt'],
    });
  }
}
