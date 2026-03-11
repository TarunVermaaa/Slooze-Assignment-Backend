const { InputType, Field, registerEnumType } = require('@nestjs/graphql');

// register the Role enum for GraphQL schema
registerEnumType({ ADMIN: 'ADMIN', MANAGER: 'MANAGER', MEMBER: 'MEMBER' }, {
  name: 'Role',
});

// register the Country enum for GraphQL schema
registerEnumType({ INDIA: 'INDIA', AMERICA: 'AMERICA' }, {
  name: 'Country',
});

// input type for user registration
class RegisterInput {}

InputType()(RegisterInput);
Field(() => String, { nullable: false })(RegisterInput.prototype, 'name');
Field(() => String, { nullable: false })(RegisterInput.prototype, 'email');
Field(() => String, { nullable: false })(RegisterInput.prototype, 'password');
Field(() => String, { nullable: true })(RegisterInput.prototype, 'role');
Field(() => String, { nullable: true })(RegisterInput.prototype, 'country');

// input type for user login
class LoginInput {}

InputType()(LoginInput);
Field(() => String, { nullable: false })(LoginInput.prototype, 'email');
Field(() => String, { nullable: false })(LoginInput.prototype, 'password');

module.exports = { RegisterInput, LoginInput };
