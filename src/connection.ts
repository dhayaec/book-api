import { createConnection, getConnectionOptions } from 'typeorm';

export const db = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: 'default'
  });
};

export const dbTest = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: 'default',
    logging: true,
    synchronize: resetDB,
    dropSchema: resetDB
  });
};

export async function createDb() {
  const connectionOptions = await getConnectionOptions('root');
  const rootConnection = await createConnection({
    ...connectionOptions,
    name: 'default'
  });

  const dbName =
    process.env.NODE_ENV === 'test'
      ? process.env.DB_NAME_TEST
      : process.env.DB_NAME;
  const grantQ =
    'GRANT ALL ON ' + dbName + '.* TO `' + process.env.DB_USER + '`@`%`;';

  await rootConnection
    .query(`CREATE DATABASE IF NOT EXISTS ${dbName};`)
    .then(async () => {
      await rootConnection.query(grantQ);
      await rootConnection.close();
    });
}
