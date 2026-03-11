const { Module } = require('@nestjs/common');
const { GraphQLModule } = require('@nestjs/graphql');
const { ApolloDriver } = require('@nestjs/apollo');
const { ConfigModule } = require('@nestjs/config');
const { APP_GUARD } = require('@nestjs/core');
const { join } = require('path');

const { PrismaModule } = require('./prisma/prisma.module');
const { AuthModule } = require('./auth/auth.module');
const { UsersModule } = require('./users/users.module');
const { RestaurantsModule } = require('./restaurants/restaurants.module');
const { CartModule } = require('./cart/cart.module');
const { OrdersModule } = require('./orders/orders.module');
const { PaymentsModule } = require('./payments/payments.module');
const { GqlAuthGuard } = require('./common/guards/gql-auth.guard');
const { RolesGuard } = require('./common/guards/roles.guard');

// root application module that wires all feature modules together
class AppModule {}

Module({
  imports: [
    // load environment variables from .env
    ConfigModule.forRoot({ isGlobal: true }),

    // configure GraphQL with Apollo driver (code-first approach)
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),

    // core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    RestaurantsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
  ],
  providers: [
    // apply JWT auth guard globally so all routes require authentication by default
    { provide: APP_GUARD, useClass: GqlAuthGuard },
    // apply roles guard globally to enforce RBAC on decorated routes
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})(AppModule);

module.exports = { AppModule };
