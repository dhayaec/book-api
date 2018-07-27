import { createConnection, getConnectionOptions } from 'typeorm';

export const db = async () => {
  const connectionOptions = await getConnectionOptions();
  return createConnection({
    ...connectionOptions,
    name: 'default',
    synchronize: true
  });
};
