import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { Document, DocumentEntity } from './entity/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentsRepository: MongoRepository<DocumentEntity>,
  ) {}

  async findAll(): Promise<Document[]> {
    const documents = await this.documentsRepository.find({
      order: { createdAt: 'DESC' },
    });

    return documents.map(this.toDocument);
  }

  async findById(id: string): Promise<Document | null> {
    const entity = await this.lookup(id);
    return entity ? this.toDocument(entity) : null;
  }

  async create(body: CreateDocumentDto): Promise<Document> {
    const entity = await this.store(body);
    return this.toDocument(entity);
  }

  async delete(id: string): Promise<boolean> {
    const objectId = this.toObjectId(id);
    if (!objectId) {
      return false;
    }

    const { deletedCount } = await this.documentsRepository.deleteOne({
      _id: objectId,
    });

    return deletedCount === 1;
  }

  private async store(body: CreateDocumentDto): Promise<DocumentEntity> {
    const { content, metadata } = body;
    const now = new Date();

    const entity = this.documentsRepository.create({
      content,
      metadata,
      createdAt: now,
      updatedAt: now,
    });

    const { insertedId } = await this.documentsRepository.insertOne(entity);
    entity._id = insertedId;

    return entity;
  }

  private async lookup(id: string): Promise<DocumentEntity | null> {
    const objectId = this.toObjectId(id);
    if (!objectId) {
      return null;
    }

    return this.documentsRepository.findOne({
      where: { _id: objectId },
    });
  }

  private readonly toDocument = (entity: DocumentEntity): Document => ({
    id: entity._id.toHexString(),
    content: entity.content,
    metadata: entity.metadata ?? {},
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });

  private toObjectId(id: string): ObjectId | null {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return new ObjectId(id);
  }
}
