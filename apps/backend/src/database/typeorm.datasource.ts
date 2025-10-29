import 'dotenv/config';
import { DataSource } from 'typeorm';

const {
  MONGODB_URI,
  MONGODB_HOST = 'localhost',
  MONGODB_PORT = '27017',
  MONGODB_DB = 'greetings',
  MONGODB_AUTH_SOURCE,
  MONGODB_USER,
  MONGODB_PASSWORD,
} = process.env;

const credentialsProvided = MONGODB_USER && MONGODB_PASSWORD;
const credentials = credentialsProvided
  ? `${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(MONGODB_PASSWORD)}@`
  : '';
const databasePath = MONGODB_DB ? `/${MONGODB_DB}` : '';
const fallbackUri = `mongodb://${credentials}${MONGODB_HOST}:${MONGODB_PORT}${databasePath}`;

const dataSource = new DataSource({
  type: 'mongodb',
  url: MONGODB_URI ?? fallbackUri,
  database: MONGODB_DB,
  synchronize: false,
  authSource: MONGODB_AUTH_SOURCE,
  username: MONGODB_USER,
  password: MONGODB_PASSWORD,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});

export default dataSource;
