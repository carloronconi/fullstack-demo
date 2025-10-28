import { Injectable } from '@nestjs/common';
import { CountryCode, Greeting } from './entity/greeting.entity';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { DEFAULT_GREETINGS } from './constants/greetings';

@Injectable()
export class GreetingsService {
  private greetings: Map<number, Greeting> = new Map(DEFAULT_GREETINGS);
  private nextId = 5;

  findAll(sort: 'asc' | 'desc' = 'asc'): Greeting[] {
    return [...this.greetings.values()].sort((a, b) => {
      if (sort === 'asc') {
        return a.createdAt.getTime() - b.createdAt.getTime();
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }

  findById(id: number): Greeting | undefined {
    return this.greetings.get(id);
  }

  findByCountry(countryCode: CountryCode): Greeting[] {
    return [...this.greetings.values()].filter(
      (greeting) => greeting.countryCode === countryCode,
    );
  }

  create({ content, countryCode }: CreateGreetingDto): Greeting {
    const newGreeting = {
      content,
      countryCode,
      createdAt: new Date(),
    };
    this.greetings.set(this.nextId++, newGreeting);
    return newGreeting;
  }

  delete(id: number): boolean {
    return this.greetings.delete(id);
  }
}
