import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

export const COUNTRY_CODES = ['US', 'ES', 'FR', 'DE'] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type Greeting = {
  id: string;
  content: string;
  countryCode: CountryCode;
  createdAt: Date;
};

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
