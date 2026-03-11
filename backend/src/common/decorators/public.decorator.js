const { SetMetadata } = require('@nestjs/common');

// key used to identify public (unauthenticated) routes
const IS_PUBLIC_KEY = 'isPublic';

// decorator to mark a resolver method as publicly accessible (no JWT required)
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

module.exports = { Public, IS_PUBLIC_KEY };
