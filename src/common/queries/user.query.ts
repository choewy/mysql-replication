import { Repository } from 'typeorm';

import { User } from '@common/entities';

export class UserQuery {
  constructor(private readonly repo: Repository<User>) {}

  async hasByEmail(email: string) {
    return !!(await this.repo.findOne({
      select: ['email'],
      where: { email },
    }));
  }

  async findUsersAndCount() {
    return this.repo.findAndCount({
      select: ['id', 'createdAt'],
    });
  }

  async findUserByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
    });
  }

  async saveUser(user: User) {
    return this.repo.save(user);
  }
}
