import { Type } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class DatabaseConfig {
  private readonly HOST: string;
  private readonly PORT: number;
  private readonly USERNAME: string;
  private readonly PASSWORD: string;
  private readonly DATABASE: string;
  private readonly SYNCHRONIZE: boolean;
  private readonly DROP_SCHEMA: boolean;

  constructor(private readonly prefix: string) {
    this.HOST = process.env[[this.prefix, 'HOST'].join('_')];
    this.PORT = Number(process.env[[this.prefix, 'PORT'].join('_')]);
    this.USERNAME = process.env[[this.prefix, 'USERNAME'].join('_')];
    this.PASSWORD = process.env[[this.prefix, 'PASSWORD'].join('_')];
    this.DATABASE = process.env[[this.prefix, 'DATABASE'].join('_')];
    this.SYNCHRONIZE = process.env[[this.prefix, 'SYNCHRONIZE'].join('_')] === 'true';
    this.DROP_SCHEMA = process.env[[this.prefix, 'DROP_SCHEMA'].join('_')] === 'true';
  }

  public getTypeOrmModuleOptions(entities: Type<any>[], name = 'default'): TypeOrmModuleOptions {
    return {
      entities,
      name,
      type: 'mysql',
      host: this.HOST,
      port: this.PORT,
      username: this.USERNAME,
      password: this.PASSWORD,
      database: this.DATABASE,
      synchronize: this.SYNCHRONIZE,
      dropSchema: this.DROP_SCHEMA,
      autoLoadEntities: true,
      extra: {
        typeCast: (field, next) => {
          if (field.type.includes('LONG')) {
            const value = field.string();
            return value ? Number(value) : null;
          }

          return next();
        },
      },
    };
  }
}
