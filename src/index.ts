import { GraphQLServer } from 'graphql-yoga';
import { genSchema } from './utils/schema-utils';
import { renderEmail } from './emails/emails';

const server = new GraphQLServer({
  schema: genSchema()
});

server.express.get('/test-email', (_, res) => {
  const random = Math.random().toString();
  const email = renderEmail({
    subject: random,
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. ' +
      'Ipsum cum distinctio temporibus error, nulla molestiae id est ' +
      'laudantium tempore eos ut sunt sed magnam incidunt porro necessitatibus' +
      'beatae! Eius, magni!',
    salutation: 'Hello dude'
  });
  res.send(email);
});

server.start(() => console.log('localhost:4000'));
