import { MigrationInterface, QueryRunner } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { DEFAULT_GREETINGS } from '../../greetings/constants/greetings';

export class SeedGreetings1761744101038 implements MigrationInterface {
  private readonly collectionName = 'greetings';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const collection = await this.getCollection(queryRunner);
    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      return;
    }

    await collection.insertMany(DEFAULT_GREETINGS);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const collection = await this.getCollection(queryRunner);
    await collection.deleteMany({});
  }

  private async getCollection(queryRunner: QueryRunner) {
    const database = this.getDatabase(queryRunner);
    const hasCollection = await database
      .listCollections({ name: this.collectionName }, { nameOnly: true })
      .hasNext();

    if (!hasCollection) {
      await database.createCollection(this.collectionName);
    }

    return database.collection(this.collectionName);
  }

  private getDatabase(queryRunner: QueryRunner) {
    const mongoRunner = queryRunner as MongoQueryRunner;
    const client = mongoRunner.databaseConnection;
    const dbName = mongoRunner.connection.driver.database;

    if (!dbName) {
      throw new TypeORMError('MongoDB database name is not configured.');
    }

    return client.db(dbName);
  }
}
