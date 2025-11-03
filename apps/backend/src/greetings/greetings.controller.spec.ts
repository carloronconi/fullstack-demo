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

  afterEach(() => {
    Object.values(mockGreetingsService).forEach((mockFn) => mockFn.mockReset());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all greetings', async () => {
    const result = [
      {
        id: '507f1f77bcf86cd799439011',
        content: 'Hello',
        countryCode: 'US',
        createdAt: new Date().toISOString(),
      },
    ];
    mockGreetingsService.findAll.mockResolvedValue(result);

    await expect(controller.findAll('asc')).resolves.toBe(result);
    expect(mockGreetingsService.findAll).toHaveBeenCalledWith('asc');
  });
});
