import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HelloResponse } from './app.contracts';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): HelloResponse {
    return this.appService.getHello();
  }
}
