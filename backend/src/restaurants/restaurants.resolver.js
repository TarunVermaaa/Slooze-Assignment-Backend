const { Resolver, Query, Args } = require('@nestjs/graphql');
const { RestaurantsService } = require('./restaurants.service');
const { RestaurantModel, MenuItemModel } = require('./restaurants.model');
const { CurrentUser } = require('../common/decorators');

// resolver for restaurant and menu item queries
class RestaurantsResolver {
  constructor(restaurantsService) {
    this.restaurantsService = restaurantsService;
  }

  // list all restaurants visible to the current user
  async restaurants(user) {
    return this.restaurantsService.findAll(user);
  }

  // get a single restaurant by its ID
  async restaurant(id, user) {
    return this.restaurantsService.findById(id, user);
  }

  // list menu items for a given restaurant
  async menuItems(restaurantId, user) {
    return this.restaurantsService.getMenuItems(restaurantId, user);
  }
}

Resolver(() => RestaurantModel)(RestaurantsResolver);
Reflect.defineMetadata('design:paramtypes', [RestaurantsService], RestaurantsResolver);

// decorate restaurants query
Query(() => [RestaurantModel])(RestaurantsResolver.prototype, 'restaurants', Object.getOwnPropertyDescriptor(RestaurantsResolver.prototype, 'restaurants'));
CurrentUser()(RestaurantsResolver.prototype, 'restaurants', 0);
Reflect.defineMetadata('design:paramtypes', [Object], RestaurantsResolver.prototype, 'restaurants');

// decorate restaurant query
Query(() => RestaurantModel, { nullable: true })(RestaurantsResolver.prototype, 'restaurant', Object.getOwnPropertyDescriptor(RestaurantsResolver.prototype, 'restaurant'));
Args('id', { type: () => String })(RestaurantsResolver.prototype, 'restaurant', 0);
CurrentUser()(RestaurantsResolver.prototype, 'restaurant', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], RestaurantsResolver.prototype, 'restaurant');

// decorate menuItems query
Query(() => [MenuItemModel])(RestaurantsResolver.prototype, 'menuItems', Object.getOwnPropertyDescriptor(RestaurantsResolver.prototype, 'menuItems'));
Args('restaurantId', { type: () => String })(RestaurantsResolver.prototype, 'menuItems', 0);
CurrentUser()(RestaurantsResolver.prototype, 'menuItems', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], RestaurantsResolver.prototype, 'menuItems');

module.exports = { RestaurantsResolver };
