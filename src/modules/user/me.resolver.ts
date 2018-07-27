import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { createMiddleware, middleware } from '../../utils/userUtils';

export const resolvers: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) =>
      User.findOne({ where: { id: session.userId } })
    )
  }
};
