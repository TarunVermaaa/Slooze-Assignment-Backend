const { ObjectType, Field, ID } = require('@nestjs/graphql');

// GraphQL object type representing a user
class UserModel {}

ObjectType('User')(UserModel);
Field(() => ID, { nullable: false })(UserModel.prototype, 'id');
Field(() => String, { nullable: false })(UserModel.prototype, 'name');
Field(() => String, { nullable: false })(UserModel.prototype, 'email');
Field(() => String, { nullable: false })(UserModel.prototype, 'role');
Field(() => String, { nullable: true })(UserModel.prototype, 'country');
Field(() => String, { nullable: false })(UserModel.prototype, 'createdAt');

module.exports = { UserModel };
