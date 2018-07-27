import * as bcrypt from 'bcryptjs';
import { userSessionIdPrefix } from '../../constants';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';

const errorResponse = [
  {
    path: 'email',
    message: 'invalid login'
  }
];

export const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session, redis, req }
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) return errorResponse;

      if (user.forgotPasswordLocked) {
        return [
          {
            path: 'email',
            message: 'forgotPasswordLocked'
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) return errorResponse;

      session.userId = user.id;
      session.email = user.email;

      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    }
  }
};
