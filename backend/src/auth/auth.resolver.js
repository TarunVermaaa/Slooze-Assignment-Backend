const { Resolver, Mutation, Args } = require('@nestjs/graphql');
const { AuthService } = require('./auth.service');
const { AuthResponse } = require('./auth.model');
const { RegisterInput, LoginInput } = require('./auth.dto');
const { Public } = require('../common/decorators');

// resolver for authentication operations (login and register)
class AuthResolver {
  constructor(authService) {
    this.authService = authService;
  }

  // register a new user account
  async register(input) {
    return this.authService.register(input);
  }

  // log in with email and password
  async login(input) {
    return this.authService.login(input.email, input.password);
  }
}

Resolver()(AuthResolver);
Reflect.defineMetadata('design:paramtypes', [AuthService], AuthResolver);

// decorate the register method
Public()(AuthResolver.prototype, 'register', Object.getOwnPropertyDescriptor(AuthResolver.prototype, 'register'));
Mutation(() => AuthResponse)(AuthResolver.prototype, 'register', Object.getOwnPropertyDescriptor(AuthResolver.prototype, 'register'));
Args('input', { type: () => RegisterInput })(AuthResolver.prototype, 'register', 0);
Reflect.defineMetadata('design:paramtypes', [RegisterInput], AuthResolver.prototype, 'register');

// decorate the login method
Public()(AuthResolver.prototype, 'login', Object.getOwnPropertyDescriptor(AuthResolver.prototype, 'login'));
Mutation(() => AuthResponse)(AuthResolver.prototype, 'login', Object.getOwnPropertyDescriptor(AuthResolver.prototype, 'login'));
Args('input', { type: () => LoginInput })(AuthResolver.prototype, 'login', 0);
Reflect.defineMetadata('design:paramtypes', [LoginInput], AuthResolver.prototype, 'login');

module.exports = { AuthResolver };
