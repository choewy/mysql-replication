import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export class JwtConfig {
  private readonly SERCRET: string;
  private readonly EXPIRES_IN: string;

  constructor(private readonly prefix: string) {
    this.SERCRET = process.env[[this.prefix, 'SECRET'].join('_')];
    this.EXPIRES_IN = process.env[[this.prefix, 'EXPIRES_IN'].join('_')];
  }

  public getSecret() {
    return this.SERCRET;
  }

  public getSignOptions(): JwtSignOptions {
    return {
      secret: this.SERCRET,
      expiresIn: this.EXPIRES_IN,
    };
  }

  public getJwtModuleOptions(): JwtModuleOptions {
    return {
      secret: this.SERCRET,
      signOptions: { expiresIn: this.EXPIRES_IN },
      verifyOptions: {},
    };
  }
}
