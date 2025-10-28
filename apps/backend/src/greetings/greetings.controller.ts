import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { IsPositivePipe } from './pipes/is-positive-pipe';
import { ApiKey } from './guards/api-key.guard';

@Controller('greetings')
export class GreetingsController {
  constructor(private greetingsService: GreetingsService) {}

  @Get()
  findAll(@Query('sort') sort: 'asc' | 'desc' = 'asc') {
    return this.greetingsService.findAll(sort);
  }

  @Get(':id')
  findById(@Param('id', IsPositivePipe) id: number) {
    const greeting = this.greetingsService.findById(id);
    if (!greeting)
      throw new HttpException('Greeting not found', HttpStatus.NOT_FOUND);
    return greeting;
  }

  @UseGuards(ApiKey)
  @Post()
  create(
    @Body(ValidationPipe)
    body: CreateGreetingDto,
  ) {
    return this.greetingsService.create(body);
  }

  @UseGuards(ApiKey)
  @Delete(':id')
  delete(@Param('id') id: number) {
    const success = this.greetingsService.delete(id);
    if (!success)
      throw new HttpException('Greeting not found', HttpStatus.NOT_FOUND);
    return true;
  }
}
