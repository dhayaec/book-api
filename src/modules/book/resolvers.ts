export const resolvers = {
  Query: {
    info: () => `This is the API of a Clone`,
    quoteOfTheDay: () =>
      Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within',
    random: () => Math.random(),
    rollDice(args: GQL.IRollDiceOnQueryArguments) {
      const output = [...Array(args.numDice).keys()];
      return output.map(
        () => 1 + Math.floor(Math.random() * (args.numSides || 6))
      );
    }
  }
};
