// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
user: IUser;
users: Array<IUser>;
welcome: string;
}

interface IUserOnQueryArguments {
id: number;
}

interface IWelcomeOnQueryArguments {
yourNickname: string;
}

interface IUser {
__typename: "User";
id: number;
userName: string;
firstName: string;
lastName: string;
}
}

// tslint:enable
