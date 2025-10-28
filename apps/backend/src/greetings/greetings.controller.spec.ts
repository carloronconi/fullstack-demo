import { Test, TestingModule } from '@nestjs/testing';
import { GreetingsController } from './greetings.controller';
import { GreetingsService } from './greetings.service';

describe('GreetingsController', () => {
  let controller: GreetingsController;

  const mockGreetingsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GreetingsController],
      providers: [
        { provide: GreetingsService, useValue: mockGreetingsService },
      ],
    }).compile();

    controller = module.get<GreetingsController>(GreetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all greetings', () => {
    const result = [
      { content: 'Hello', countryCode: 'US', createdAt: new Date() },
    ];
    mockGreetingsService.findAll.mockReturnValue(result);

    expect(controller.findAll('asc')).toBe(result);
    expect(mockGreetingsService.findAll).toHaveBeenCalledWith('asc');
  });
});
