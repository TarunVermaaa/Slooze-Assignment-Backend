const { Resolver, Query } = require('@nestjs/graphql');
const { UsersService } = require('./users.service');
const { UserModel } = require('./user.model');
const { CurrentUser, Roles } = require('../common/decorators');

// resolver for user-related queries
class UsersResolver {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // return the currently logged-in user's profile
  async me(user) {
    return this.usersService.getProfile(user.id);
  }

  // return all users (admin only)
  async users() {
    return this.usersService.findAll();
  }
}

Resolver(() => UserModel)(UsersResolver);
Reflect.defineMetadata('design:paramtypes', [UsersService], UsersResolver);

// decorate 'me' query
Query(() => UserModel)(UsersResolver.prototype, 'me', Object.getOwnPropertyDescriptor(UsersResolver.prototype, 'me'));
CurrentUser()(UsersResolver.prototype, 'me', 0);
Reflect.defineMetadata('design:paramtypes', [Object], UsersResolver.prototype, 'me');

// decorate 'users' query (admin only)
Roles('ADMIN')(UsersResolver.prototype, 'users', Object.getOwnPropertyDescriptor(UsersResolver.prototype, 'users'));
Query(() => [UserModel])(UsersResolver.prototype, 'users', Object.getOwnPropertyDescriptor(UsersResolver.prototype, 'users'));
Reflect.defineMetadata('design:paramtypes', [], UsersResolver.prototype, 'users');

module.exports = { UsersResolver };
