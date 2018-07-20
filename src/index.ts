import { GraphQLServer } from 'graphql-yoga';
import { genSchema } from './utils/getSchema';

const server = new GraphQLServer({
  schema: genSchema()
});

server.start(() => console.log('localhost:4000'));
