const { ObjectType, Field, ID } = require('@nestjs/graphql');

// GraphQL response type for authentication operations
class AuthResponse {}

ObjectType()(AuthResponse);
Field(() => String, { nullable: false })(AuthResponse.prototype, 'token');
Field(() => require('../users/user.model').UserModel, { nullable: false })(AuthResponse.prototype, 'user');

module.exports = { AuthResponse };
