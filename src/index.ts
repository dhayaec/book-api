import { GraphQLServer } from 'graphql-yoga';
import { genSchema } from './utils/schema-utils';
import { renderEmail } from './utils/emails/emails';
import { createConnection } from 'typeorm';
import { Photo } from './entity/Photo';

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

const startServer = async () => {
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      url: request.protocol + '://' + request.get('host'),
      session: request.session,
      req: request
    })
  });

  try {
    const connection = await createConnection({
      name: 'default',
      type: 'mariadb',
      host: 'localhost',
      port: 3307,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [Photo],
      synchronize: true
    });
    const photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true;

    const photoRepository = connection.getRepository(Photo);

    await photoRepository.save(photo);
    console.log('Photo has been saved');

    const savedPhotos = await photoRepository.find();
    console.log('All photos from the db: ', savedPhotos);

    const meAndBearsPhoto = await photoRepository.findOne({
      name: 'Me and Bears'
    });
    console.log('Me and Bears photo from the db: ', meAndBearsPhoto);
  } catch (error) {
    console.log(error);
  }

  server.start(() => console.log('localhost:4000'));
};

startServer();
