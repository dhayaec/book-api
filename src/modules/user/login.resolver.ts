import * as bcrypt from 'bcryptjs';
import { userSessionIdPrefix } from '../../constants';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import {
  confirmEmailError,
  forgotPasswordLockedError
} from '../../utils/messages';

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

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return [
          {
            path: 'email',
            message: confirmEmailError
          }
        ];
      }

      if (user.forgotPasswordLocked) {
        return [
          {
            path: 'email',
            message: forgotPasswordLockedError
          }
        ];
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return errorResponse;
      }

      // login sucessful
      session.userId = user.id;
      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
    }
  }
};
