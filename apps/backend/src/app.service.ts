import { Injectable } from '@nestjs/common';
import { HelloResponse } from './app.contracts';

@Injectable()
export class AppService {
  getHello(): HelloResponse {
    return {
      message: 'Hello from the NestJS backend!',
      timestamp: new Date().toISOString(),
    };
  }
}
