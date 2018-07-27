import { createConnection, getConnectionOptions } from 'typeorm';

export const db = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: 'default'
  });
};
