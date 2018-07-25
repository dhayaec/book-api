import { GraphQLServer } from 'graphql-yoga';
import { genSchema } from './utils/schema-utils';
import { renderEmail } from './utils/emails/emails';
import { db } from './utils/connection';
import { Photo } from './entity/Photo';

process.on('unhandledRejection', err => {
  console.log(err);
});

process.on('uncaughtException', err => {
  console.log(err);
});

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

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      url: request.protocol + '://' + request.get('host'),
      session: request.session,
      req: request
    })
  });

  const photo = new Photo();
  photo.name = 'Me and Bears';
  photo.description = 'I am near polar bears';
  photo.filename = 'photo-with-bears.jpg';
  photo.views = 1;
  photo.isPublished = true;

  const connection = await db();

  const photoRepository = connection.getRepository(Photo);

  const savedPhotos = await photoRepository.find();

  console.log('All photos from the db: ', savedPhotos);
  try {
    const app = await server.start(() => console.log('localhost:4000'));
    return app;
  } catch (error) {
    console.log(error);
  }
};
