import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import {
  CountryCode,
  Greeting,
  GreetingEntity,
} from './entity/greeting.entity';

@Injectable()
export class GreetingsService {
  constructor(
    @InjectRepository(GreetingEntity)
    private readonly greetingsRepository: MongoRepository<GreetingEntity>,
  ) {}

  async findAll(sort: 'asc' | 'desc' = 'asc'): Promise<Greeting[]> {
    const greetings = await this.greetingsRepository.find({
      order: { createdAt: sort === 'asc' ? 'ASC' : 'DESC' },
    });
    return greetings.map(this.toGreeting);
  }

  async findById(id: string): Promise<Greeting | null> {
    const objectId = this.toObjectId(id);
    if (!objectId) {
      return null;
    }

    const greeting = await this.greetingsRepository.findOne({
      where: { _id: objectId },
    });

    return greeting ? this.toGreeting(greeting) : null;
  }

  async findByCountry(countryCode: CountryCode): Promise<Greeting[]> {
    const greetings = await this.greetingsRepository.find({
      where: { countryCode },
      order: { createdAt: 'DESC' },
    });

    return greetings.map(this.toGreeting);
  }

  async create({ content, countryCode }: CreateGreetingDto): Promise<string> {
    const entity = this.greetingsRepository.create({
      content,
      countryCode,
      createdAt: new Date(),
    });

    const { insertedId } = await this.greetingsRepository.insertOne(entity);

    return insertedId.toHexString();
  }

  async delete(id: string): Promise<boolean> {
    const objectId = this.toObjectId(id);
    if (!objectId) {
      return false;
    }

    const result = await this.greetingsRepository.deleteOne({
      _id: objectId,
    });

    return result.deletedCount === 1;
  }

  private toGreeting = (entity: GreetingEntity): Greeting => ({
    id: entity._id.toHexString(),
    content: entity.content,
    countryCode: entity.countryCode,
    createdAt: entity.createdAt,
  });

  private toObjectId(id: string): ObjectId | null {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return new ObjectId(id);
  }
}
