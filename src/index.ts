import { GraphQLServer } from 'graphql-yoga';
import { genSchema } from './utils/schema-utils';

const server = new GraphQLServer({
  schema: genSchema()
});

server.start(() => console.log('localhost:4000'));
