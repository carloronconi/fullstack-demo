import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { GreetingsService } from './greetings.service';
import { GreetingEntity } from './entity/greeting.entity';

describe('GreetingsService', () => {
  let service: GreetingsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    insertOne: jest.fn(),
    save: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GreetingsService,
        {
          provide: getRepositoryToken(GreetingEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GreetingsService>(GreetingsService);
  });

  afterEach(() => {
    Object.values(mockRepository).forEach((mockFn) => mockFn.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the inserted id', async () => {
    const dto = { content: 'Hola', countryCode: 'ES' as const };

    const entity = new GreetingEntity({
      content: dto.content,
      countryCode: dto.countryCode,
      createdAt: new Date('2024-01-01'),
    });
    const insertedId = new ObjectId('507f1f77bcf86cd799439011');

    mockRepository.create.mockReturnValue(entity);
    mockRepository.insertOne.mockResolvedValue({ insertedId });

    const id = await service.create(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        content: dto.content,
        countryCode: dto.countryCode,
      }),
    );
    expect(mockRepository.insertOne).toHaveBeenCalledWith(entity);
    expect(id).toBe(insertedId.toHexString());
  });
});
