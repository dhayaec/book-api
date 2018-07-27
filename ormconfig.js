module.exports = {
  name: 'default',
  type: 'mariadb',
  host: 'localhost',
  port: 3307,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: false,
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
};
