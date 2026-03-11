const { Module } = require('@nestjs/common');
const { UsersService } = require('./users.service');
const { UsersResolver } = require('./users.resolver');

// module for user profile and listing operations
class UsersModule {}

Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})(UsersModule);

module.exports = { UsersModule };
