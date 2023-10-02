import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { User } from '@common/entities';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
}
