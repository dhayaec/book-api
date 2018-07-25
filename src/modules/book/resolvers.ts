import { ResolverMap } from '../../types/graphql-utils';

const usersData = {
  users: [
    { id: 1, userName: 'john', firstName: 'John', lastName: 'Smith' },
    { id: 2, userName: 'kim', firstName: 'Kimberly', lastName: 'Jones' },
  ],
};

export const resolvers: ResolverMap = {
  Query: {
    user: async (_, args: GQL.IUserOnQueryArguments) => {
      const { id } = args;
      const user = await usersData.users.find(u => u.id === id);
      return user;
    },
    users: () => usersData.users,
    welcome: (_, { yourNickname }: GQL.IWelcomeOnQueryArguments) =>
      `Welcome, ${yourNickname || 'here'}!`,
  },
};
