const { Injectable, CanActivate, ExecutionContext } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { GqlExecutionContext } = require('@nestjs/graphql');
const { ROLES_KEY } = require('../decorators/roles.decorator');

// guard that checks whether the current user has a required role
class RolesGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }

  // determine if the request should be allowed based on role metadata
  canActivate(context) {
    // read the roles metadata set by @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // if no roles are specified, the route is open to all authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // extract user from the GraphQL context
    const gqlCtx = GqlExecutionContext.create(context);
    const user = gqlCtx.getContext().req.user;

    // check if user's role is in the allowed list
    return requiredRoles.includes(user.role);
  }
}

Injectable()(RolesGuard);

// inject Reflector via constructor
const Inject = require('@nestjs/common').Inject;
Reflect.defineMetadata('design:paramtypes', [Reflector], RolesGuard);

module.exports = { RolesGuard };
