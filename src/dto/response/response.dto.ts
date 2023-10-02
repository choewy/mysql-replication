import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
  constructor(public readonly status: HttpStatus, public readonly data: T) {}
}
