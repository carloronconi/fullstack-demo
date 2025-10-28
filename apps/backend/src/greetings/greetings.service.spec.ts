import { Test, TestingModule } from '@nestjs/testing';
import { GreetingsService } from './greetings.service';

describe('GreetingsService', () => {
  let service: GreetingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GreetingsService],
    }).compile();

    service = module.get<GreetingsService>(GreetingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the created greeting', () => {
    const dto = { content: 'Hola', countryCode: 'ES' as const };
    const greeting = service.create(dto);
    const allGreetings = service.findAll();
    expect(allGreetings).toContain(greeting);
  });
});
