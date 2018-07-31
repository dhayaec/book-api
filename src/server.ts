import 'reflect-metadata';
require('dotenv-safe').config();
import * as connectRedis from 'connect-redis';
import * as RateLimit from 'express-rate-limit';
import * as session from 'express-session';
import { GraphQLServer } from 'graphql-yoga';
import * as helmet from 'helmet';
import * as Redis from 'ioredis';
import * as RateLimitRedisStore from 'rate-limit-redis';
import { createDb, db, dbTest } from './connection';
import { redisSessionPrefix } from './constants';
import { testEmail } from './routes/email';
import { genSchema } from './utils/schema-utils';

const redisStore = connectRedis(session as any);

const redis = new Redis();

export async function startServer() {
  if (process.env.NODE_ENV === 'test') {
    await redis.flushall();
  }

  await createDb();

  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
      session: request.session,
      req: request
    })
  });

  server.express.use(helmet());

  server.express.use(
    new RateLimit({
      store: new RateLimitRedisStore({
        client: redis
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      delayMs: 0 // disable delaying - full speed until the max limit is reached
    })
  );

  server.express.use(
    session({
      store: new redisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      name: 'qid',
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  if (process.env.NODE_ENV !== 'test') {
    const connection = await db();
    await connection.runMigrations();
  } else {
    await dbTest(true);
  }

  server.express.get('/ping', (_, res) => res.json({ message: 'pong' }));
  server.express.get('/test-email', testEmail);

  return server.start(
    { port: process.env.NODE_ENV === 'test' ? 4001 : 4000 },
    ({ port }) => console.log('localhost:' + port)
  );
}
