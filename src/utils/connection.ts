import { createConnection } from 'typeorm';
import { Photo } from '../entity/Photo';
import { User } from '../entity/User';

export const db = async () => {
  const connection = await createConnection({
    name: 'default',
    type: 'mariadb',
    host: 'localhost',
    port: 3307,
    username: 'test',
    password: 'test',
    database: 'test',
    entities: [User, Photo],
    synchronize: true
  });

  return connection;
};
