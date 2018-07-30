import * as yup from 'yup';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import {
  duplicateEmail,
  emailNotLongEnough,
  passwordNotLongEnough
} from '../../utils/messages';
import { formatYupError } from '../../utils/userUtils';
import { invalidEmail } from './../../utils/messages';

export const registerPasswordValidation = yup
  .string()
  .min(6, passwordNotLongEnough)
  .max(255)
  .required();

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail),
  password: registerPasswordValidation
});

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args: GQL.IRegisterOnMutationArguments) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id']
      });

      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail
          }
        ];
      }

      const user = User.create({
        email,
        password
      });

      await user.save();

      // if (process.env.NODE_ENV !== "test") {
      //   await sendEmail(
      //     email,
      //     await createConfirmEmailLink(url, user.id, redis)
      //   );
      // }
      return null;
    }
  }
};
