const { ObjectType, Field, ID, Float } = require('@nestjs/graphql');

// GraphQL object type representing a restaurant
class RestaurantModel {}

ObjectType('Restaurant')(RestaurantModel);
Field(() => ID, { nullable: false })(RestaurantModel.prototype, 'id');
Field(() => String, { nullable: false })(RestaurantModel.prototype, 'name');
Field(() => String, { nullable: false })(RestaurantModel.prototype, 'country');
Field(() => String, { nullable: false })(RestaurantModel.prototype, 'address');
Field(() => [MenuItemModel], { nullable: false })(RestaurantModel.prototype, 'menuItems');

// GraphQL object type representing a menu item within a restaurant
class MenuItemModel {}

ObjectType('MenuItem')(MenuItemModel);
Field(() => ID, { nullable: false })(MenuItemModel.prototype, 'id');
Field(() => String, { nullable: false })(MenuItemModel.prototype, 'name');
Field(() => String, { nullable: false })(MenuItemModel.prototype, 'description');
Field(() => Float, { nullable: false })(MenuItemModel.prototype, 'price');
Field(() => String, { nullable: false })(MenuItemModel.prototype, 'restaurantId');

module.exports = { RestaurantModel, MenuItemModel };
