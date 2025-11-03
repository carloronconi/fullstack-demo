import { type CountryCode } from '@fullstack-demo/contracts/greetings';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'greetings' })
export class GreetingEntity {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  content!: string;

  @Column()
  countryCode!: CountryCode;

  @Column()
  createdAt!: Date;

  constructor(partial?: Partial<GreetingEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
