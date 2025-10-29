import { GreetingEntity } from '../entity/greeting.entity';

type SeedGreeting = Omit<GreetingEntity, '_id'>;

export const DEFAULT_GREETINGS: SeedGreeting[] = [
  {
    content: 'Hello',
    countryCode: 'US',
    createdAt: new Date('2022-07-01'),
  },
  {
    content: 'Hola',
    countryCode: 'ES',
    createdAt: new Date('2025-09-17'),
  },
  {
    content: 'Bonjour',
    countryCode: 'FR',
    createdAt: new Date('2023-02-05'),
  },
  {
    content: 'Hallo',
    countryCode: 'DE',
    createdAt: new Date('1983-11-08'),
  },
];
