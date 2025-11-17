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
    createCollectionIndex: jest.fn(),
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

    await module.init();
    service = module.get<GreetingsService>(GreetingsService);
  });

  afterEach(() => {
    Object.values(mockRepository).forEach((mockFn) => mockFn.mockReset());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should ensure an index on createdAt during initialization', () => {
    expect(mockRepository.createCollectionIndex).toHaveBeenCalledWith({
      createdAt: 1,
    });
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

  it('should perform cursor pagination and derive next cursor when more data exists', async () => {
    const cursorEntity = new GreetingEntity({
      _id: new ObjectId('507f1f77bcf86cd799439011'),
      content: 'Start',
      countryCode: 'US',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    });

    const firstEntity = new GreetingEntity({
      _id: new ObjectId('507f1f77bcf86cd799439012'),
      content: 'Hello',
      countryCode: 'US',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
    });

    const secondEntity = new GreetingEntity({
      _id: new ObjectId('507f1f77bcf86cd799439013'),
      content: 'Hola',
      countryCode: 'ES',
      createdAt: new Date('2024-01-03T00:00:00.000Z'),
    });

    mockRepository.findOne.mockResolvedValue(cursorEntity);
    mockRepository.find.mockResolvedValue([firstEntity, secondEntity]);

    const result = await service.findAll({
      limit: 1,
      sort: 'asc',
      cursorId: cursorEntity._id.toHexString(),
    });

    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { _id: cursorEntity._id },
    });

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: {
        $or: [
          { createdAt: { $gt: cursorEntity.createdAt } },
          { createdAt: cursorEntity.createdAt, _id: { $gt: cursorEntity._id } },
        ],
      },
      order: { createdAt: 'ASC', _id: 'ASC' },
      take: 2,
    });

    expect(result).toEqual({
      items: [
        {
          id: firstEntity._id.toHexString(),
          content: firstEntity.content,
          countryCode: firstEntity.countryCode,
          createdAt: firstEntity.createdAt.toISOString(),
        },
      ],
      limit: 1,
      sort: 'asc',
      nextAscCursorId: firstEntity._id.toHexString(),
      nextDescCursorId: firstEntity._id.toHexString(),
    });
  });
});
