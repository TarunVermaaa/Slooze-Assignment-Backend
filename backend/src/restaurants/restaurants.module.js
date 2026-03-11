const { Module } = require('@nestjs/common');
const { RestaurantsService } = require('./restaurants.service');
const { RestaurantsResolver } = require('./restaurants.resolver');

// module for restaurant and menu item operations
class RestaurantsModule {}

Module({
  providers: [RestaurantsService, RestaurantsResolver],
  exports: [RestaurantsService],
})(RestaurantsModule);

module.exports = { RestaurantsModule };
