import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { forgotPasswordPrefix } from '../../constants';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import {
  expiredKeyError,
  forgotPasswordLockedError,
} from '../../utils/messages';
import {
  createForgotPasswordLink,
  forgotPasswordLockAccount,
  formatYupError,
} from '../../utils/userUtils';
import { registerPasswordValidation } from './register.resolver';

const schema = yup.object().shape({
  newPassword: registerPasswordValidation,
});

export const resolvers: ResolverMap = {
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { redis },
    ) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return [
          {
            path: 'email',
            message: forgotPasswordLockedError,
          },
        ];
      }

      await forgotPasswordLockAccount(user.id, redis);
      // @todo add frontend url
      await createForgotPasswordLink('', user.id, redis);
      // @todo send email with url
      return true;
    },
    forgotPasswordChange: async (
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments,
      { redis },
    ) => {
      const redisKey = `${forgotPasswordPrefix}${key}`;

      const userId = await redis.get(redisKey);
      if (!userId) {
        return [
          {
            path: 'key',
            message: expiredKeyError,
          },
        ];
      }

      try {
        await schema.validate({ newPassword }, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePromise = User.update(
        { id: userId },
        {
          forgotPasswordLocked: false,
          password: hashedPassword,
        },
      );

      const deleteKeyPromise = redis.del(redisKey);

      await Promise.all([updatePromise, deleteKeyPromise]);

      return null;
    },
  },
};
