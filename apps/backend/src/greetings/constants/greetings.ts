import { Greeting } from '../entity/greeting.entity';

export const DEFAULT_GREETINGS = [
  [
    1,
    {
      content: 'Hello',
      countryCode: 'US',
      createdAt: new Date('2022-07-01'),
    } as Greeting,
  ],
  [
    2,
    {
      content: 'Hola',
      countryCode: 'ES',
      createdAt: new Date('2025-09-17'),
    } as Greeting,
  ],
  [
    3,
    {
      content: 'Bonjour',
      countryCode: 'FR',
      createdAt: new Date('2023-02-05'),
    } as Greeting,
  ],
  [
    4,
    {
      content: 'Hallo',
      countryCode: 'DE',
      createdAt: new Date('1983-11-08'),
    } as Greeting,
  ],
] as const;
