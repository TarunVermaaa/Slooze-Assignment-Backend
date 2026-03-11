const { GqlAuthGuard } = require('./gql-auth.guard');
const { RolesGuard } = require('./roles.guard');

module.exports = { GqlAuthGuard, RolesGuard };
