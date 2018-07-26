import * as connectRedis from 'connect-redis';
import * as RateLimit from 'express-rate-limit';
import * as session from 'express-session';
import { GraphQLServer } from 'graphql-yoga';
import * as helmet from 'helmet';
import * as Redis from 'ioredis';
import * as RateLimitRedisStore from 'rate-limit-redis';
import { redisSessionPrefix, SESSION_SECRET } from './constants';
import { testEmail } from './routes/email';
import { genSchema } from './utils/schema-utils';
import { User } from './entity/User';
import { db } from './utils/connection';

export async function startServer() {
  const redisStore = connectRedis(session);

  const redis = new Redis();

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
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  const connection = await db();

  const user = new User();
  user.email = 'mmurali47566@gmail.com';
  user.password = '123456';
  user.mobile = '9445725619';

  const userRepository = connection.getRepository(User);
  const { email } = user;
  const existingUser = await userRepository.findOne({ email });

  if (!existingUser) {
    try {
      await userRepository.save(user);
    } catch (error) {
      console.log(error);
    }
  } else {
    const username = existingUser.email.split('@')[0];
    !existingUser.username &&
      (await userRepository.update({ id: existingUser.id }, { username }));
  }
  server.express.get('/ping', (_, res) => res.json({ message: 'pong' }));
  server.express.get('/test-email', testEmail);

  return server.start(
    { port: process.env.NODE_ENV === 'test' ? 4001 : 4000 },
    ({ port }) => console.log('localhost:' + port)
  );
}
