import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GreetingsController } from './greetings.controller';
import { GreetingsService } from './greetings.service';
import { GreetingEntity } from './entity/greeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GreetingEntity])],
  controllers: [GreetingsController],
  providers: [GreetingsService],
})
export class GreetingsModule {}
