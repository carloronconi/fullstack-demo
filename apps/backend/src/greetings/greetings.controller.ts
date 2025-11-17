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
import {
  type CursorPaginationResult,
  type Greeting,
} from '@fullstack-demo/contracts/greetings';
import { GreetingsService } from './greetings.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { ListGreetingsDto } from './dto/list-greetings.dto';
import { ApiKey } from './guards/api-key.guard';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';

@Controller('greetings')
export class GreetingsController {
  constructor(private greetingsService: GreetingsService) {}

  @Get()
  async findAll(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    query: ListGreetingsDto,
  ): Promise<CursorPaginationResult<Greeting>> {
    return this.greetingsService.findAll({
      limit: query.limit,
      sort: query.sort,
      cursorId: query.cursorId,
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const greeting = await this.greetingsService.findById(id);
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
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const success = await this.greetingsService.delete(id);
    if (!success)
      throw new HttpException('Greeting not found', HttpStatus.NOT_FOUND);
    return true;
  }
}
