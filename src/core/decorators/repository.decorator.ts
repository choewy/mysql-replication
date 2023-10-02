import { Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DatabaseType } from '@core/constants';

export const InjectSlaveRepository = (entity: Type<any>) => InjectRepository(entity, DatabaseType.SLAVE);
