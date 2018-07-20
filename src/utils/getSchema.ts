import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

export function genSchema() {
  const pathToModules = path.join(__dirname, '../modules');

  const paths = glob.sync(`${pathToModules}/**/*.graphql`);
  const graphqlTypes = paths.map(x => fs.readFileSync(x, { encoding: 'utf8' }));
  const resolversList = glob
    .sync(`${pathToModules}/**/resolvers.?s`)
    .map(resolver => require(resolver).resolvers);

  return makeExecutableSchema({
    typeDefs: mergeTypes(graphqlTypes),
    resolvers: mergeResolvers(resolversList)
  });
}
