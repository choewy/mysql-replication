import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
  private readonly SALT_OR_ROUNTS = 10;

  public hash(plainText: string) {
    return bcrypt.hashSync(plainText, this.SALT_OR_ROUNTS);
  }

  public compare(plainText: string, hashedText: string) {
    return bcrypt.compareSync(plainText, hashedText);
  }
}
