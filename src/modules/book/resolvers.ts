const usersData = {
  users: [
    { id: 1, userName: 'john', firstName: 'John', lastName: 'Smith' },
    { id: 2, userName: 'kim', firstName: 'Kimberly', lastName: 'Jones' }
  ]
};

export const resolvers = {
  Query: {
    user: async (_ = {}, { id }: GQL.IUserOnQueryArguments) => {
      const user = await usersData.users.find(user => user.id === id);
      return user;
    },
    users: () => usersData.users,
    welcome: (_ = {}, { yourNickname }: GQL.IWelcomeOnQueryArguments) =>
      `Welcome, ${yourNickname || 'here'}!`
  }
};
