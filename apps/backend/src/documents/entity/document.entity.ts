import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

export type DocumentMetadata = {
  title?: string;
  author?: string;
};

export type Document = {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  createdAt: Date;
  updatedAt: Date;
};

@Entity({ name: 'documents' })
export class DocumentEntity {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  content!: string;

  @Column()
  metadata!: DocumentMetadata;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  constructor(partial?: Partial<DocumentEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
