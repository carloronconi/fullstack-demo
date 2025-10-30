import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DocumentEntity } from './entity/document.entity';
import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  let service: DocumentsService;

  const repositoryMock: Partial<MongoRepository<DocumentEntity>> = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    insertOne: jest.fn(),
    deleteOne: jest.fn(),
    updateOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => {
    Object.values(repositoryMock).forEach((mockFn) =>
      (mockFn as jest.Mock).mockReset(),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
