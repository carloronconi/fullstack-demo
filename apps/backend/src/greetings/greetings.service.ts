import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, type Filter } from 'mongodb';
import { MongoRepository } from 'typeorm';
import {
  type CursorPaginationResult,
  type CountryCode,
  type Greeting,
} from '@fullstack-demo/contracts/greetings';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { GreetingEntity } from './entity/greeting.entity';

@Injectable()
export class GreetingsService implements OnModuleInit {
  constructor(
    @InjectRepository(GreetingEntity)
    private readonly greetingsRepository: MongoRepository<GreetingEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.greetingsRepository.createCollectionIndex({ createdAt: 1 });
  }

  async findAll({
    limit,
    sort,
    cursorId,
  }: {
    limit: number;
    sort: 'asc' | 'desc';
    cursorId?: string;
  }): Promise<CursorPaginationResult<Greeting>> {
    const cursorEntity = cursorId
      ? await this.getCursorEntity(cursorId)
      : undefined;

    const where = this.buildCursorFilter(cursorEntity, sort);
    const orderDirection = sort === 'asc' ? 'ASC' : 'DESC';
    const greetings = await this.greetingsRepository.find({
      ...(where ? { where } : {}),
      order: { createdAt: orderDirection, _id: orderDirection },
      take: limit + 1,
    });

    const hasMore = greetings.length > limit;
    const paginated = hasMore ? greetings.slice(0, limit) : greetings;

    const items = paginated.map(this.toGreeting);

    let nextAscCursorId: string | null = null;
    let nextDescCursorId: string | null = null;

    if (paginated.length > 0) {
      const first = paginated[0];
      const last = paginated[paginated.length - 1];

      if (sort === 'asc') {
        nextAscCursorId = hasMore ? last._id.toHexString() : null;
        nextDescCursorId = cursorEntity ? first._id.toHexString() : null;
      } else {
        nextDescCursorId = hasMore ? last._id.toHexString() : null;
        nextAscCursorId = cursorEntity ? first._id.toHexString() : null;
      }
    }

    return {
      items,
      limit,
      sort,
      nextAscCursorId,
      nextDescCursorId,
    };
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
    createdAt: entity.createdAt.toISOString(),
  });

  private buildCursorFilter(
    cursor: GreetingEntity | undefined,
    sort: 'asc' | 'desc',
  ): Filter<GreetingEntity> | undefined {
    if (!cursor) {
      return undefined;
    }

    const operator = sort === 'asc' ? '$gt' : '$lt';

    return {
      $or: [
        { createdAt: { [operator]: cursor.createdAt } },
        { createdAt: cursor.createdAt, _id: { [operator]: cursor._id } },
      ],
    };
  }

  private toObjectId(id: string): ObjectId | null {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return new ObjectId(id);
  }

  private async getCursorEntity(
    cursorId: string,
  ): Promise<GreetingEntity | undefined> {
    const objectId = this.toObjectId(cursorId);
    if (!objectId) {
      return undefined;
    }

    const entity = await this.greetingsRepository.findOne({
      where: { _id: objectId },
    });

    return entity ?? undefined;
  }
}
