import { Test, TestingModule } from '@nestjs/testing';
import { ListGreetingsDto } from './dto/list-greetings.dto';
import { GreetingsController } from './greetings.controller';
import { GreetingsService } from './greetings.service';

describe('GreetingsController', () => {
  let controller: GreetingsController;

  const mockGreetingsService: jest.Mocked<
    Pick<GreetingsService, 'findAll' | 'findById' | 'create' | 'delete'>
  > = {
    findAll: jest.fn<
      ReturnType<GreetingsService['findAll']>,
      Parameters<GreetingsService['findAll']>
    >(),
    findById: jest.fn<
      ReturnType<GreetingsService['findById']>,
      Parameters<GreetingsService['findById']>
    >(),
    create: jest.fn<
      ReturnType<GreetingsService['create']>,
      Parameters<GreetingsService['create']>
    >(),
    delete: jest.fn<
      ReturnType<GreetingsService['delete']>,
      Parameters<GreetingsService['delete']>
    >(),
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

  it('should forward pagination parameters to the service', async () => {
    const query = Object.assign(new ListGreetingsDto(), {
      limit: 5,
      sort: 'desc' as const,
      cursorId: '507f1f77bcf86cd799439011',
    });
    const serviceResponse = {
      items: [],
      limit: query.limit,
      sort: query.sort,
      nextAscCursorId: null,
      nextDescCursorId: null,
    };
    mockGreetingsService.findAll.mockResolvedValue(serviceResponse);

    await expect(controller.findAll(query)).resolves.toBe(serviceResponse);

    const callArgs = mockGreetingsService.findAll.mock.calls[0][0];

    expect(callArgs).toEqual({
      limit: query.limit,
      sort: query.sort,
      cursorId: query.cursorId,
    });
  });
});
