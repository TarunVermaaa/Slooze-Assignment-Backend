const { createParamDecorator } = require('@nestjs/common');
const { GqlExecutionContext } = require('@nestjs/graphql');

// extract the authenticated user from the GraphQL execution context
const CurrentUser = createParamDecorator((data, ctx) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  return gqlCtx.getContext().req.user;
});

module.exports = { CurrentUser };
