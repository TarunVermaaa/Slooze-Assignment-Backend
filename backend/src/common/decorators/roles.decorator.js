const { SetMetadata } = require('@nestjs/common');

// key used to store role metadata on route handlers
const ROLES_KEY = 'roles';

// decorator to mark which roles can access a given resolver method
const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);

module.exports = { Roles, ROLES_KEY };
