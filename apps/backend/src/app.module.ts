import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dataSource from './database/typeorm.datasource';
import { GreetingsModule } from './greetings/greetings.module';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { migrations, subscribers, entities, ...sharedOptions } =
  dataSource.options;

const typeOrmOptions: TypeOrmModuleOptions = {
  ...sharedOptions,
  autoLoadEntities: true,
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmOptions),
    GreetingsModule,
  ],
})
export class AppModule {}
