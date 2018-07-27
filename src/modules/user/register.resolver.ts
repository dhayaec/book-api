import * as yup from 'yup';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types/graphql-utils';
import { formatYupError } from '../../utils/userUtils';

export const registerPasswordValidation = yup
  .string()
  .min(6, 'password should be minimum 6 characters long')
  .max(255)
  .required();

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, 'email is not long enough')
    .max(255)
    .email('invalid email'),
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
            message: 'email already registered'
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
