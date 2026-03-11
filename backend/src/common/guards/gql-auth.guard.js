const { Injectable, ExecutionContext } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');
const { Reflector } = require('@nestjs/core');
const { GqlExecutionContext } = require('@nestjs/graphql');
const { IS_PUBLIC_KEY } = require('../decorators/public.decorator');

// JWT auth guard adapted for GraphQL context
class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(reflector) {
    super();
    this.reflector = reflector;
  }

  // override to check for @Public() decorator before enforcing auth
  canActivate(context) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // skip authentication for public routes
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  // convert GraphQL execution context to HTTP-like request for Passport
  getRequest(context) {
    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext().req;
  }
}

Injectable()(GqlAuthGuard);
Reflect.defineMetadata('design:paramtypes', [Reflector], GqlAuthGuard);

module.exports = { GqlAuthGuard };
