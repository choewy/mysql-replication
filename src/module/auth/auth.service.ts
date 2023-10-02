import { DataSource, Repository } from 'typeorm';
import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectSlaveRepository } from '@common/decorators';
import { BcryptService } from '@common/services';
import { UserQuery } from '@common/queries';
import { User } from '@common/entities';

import { ResponseDto } from '@dto/response';
import { SignInBodyDto, SignUpBodyDto } from '@dto/auth';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '@core/configs';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectSlaveRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  private issueAccessToken(id: number) {
    return this.jwtService.sign({ id }, new JwtConfig('JWT').getSignOptions());
  }

  async signin(dto: SignInBodyDto) {
    const user = await new UserQuery(this.userRepository).findUserByEmail(dto.email);

    if (!user || !this.bcryptService.compare(dto.password, user.password)) {
      throw new UnauthorizedException(new ResponseDto(HttpStatus.UNAUTHORIZED, 'invalid email or password.'));
    }

    return new ResponseDto(HttpStatus.CREATED, {
      accessToken: this.issueAccessToken(user.id),
    });
  }

  async signup(dto: SignUpBodyDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException(new ResponseDto(HttpStatus.BAD_REQUEST, 'incorrect passwords.'));
    }

    if (await new UserQuery(this.userRepository).hasByEmail(dto.email)) {
      throw new BadRequestException(new ResponseDto(HttpStatus.BAD_REQUEST, 'already used email.'));
    }

    const userRepository = this.dataSource.getRepository(User);
    const user = await new UserQuery(userRepository).saveUser(
      userRepository.create({
        email: dto.email,
        nickname: dto.nickname,
        password: this.bcryptService.hash(dto.password),
      }),
    );

    return new ResponseDto(HttpStatus.CREATED, {
      accessToken: this.issueAccessToken(user.id),
    });
  }
}
