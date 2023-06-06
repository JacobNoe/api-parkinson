import { Injectable } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
