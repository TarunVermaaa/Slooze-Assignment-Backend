const { ObjectType, Field, ID, Int, Float } = require('@nestjs/graphql');
const { MenuItemModel } = require('../restaurants/restaurants.model');

// GraphQL object type representing a cart item
class CartItemModel {}

ObjectType('CartItem')(CartItemModel);
Field(() => ID, { nullable: false })(CartItemModel.prototype, 'id');
Field(() => String, { nullable: false })(CartItemModel.prototype, 'menuItemId');
Field(() => Int, { nullable: false })(CartItemModel.prototype, 'quantity');
Field(() => MenuItemModel, { nullable: false })(CartItemModel.prototype, 'menuItem');

// GraphQL object type representing a user's cart
class CartModel {}

ObjectType('Cart')(CartModel);
Field(() => ID, { nullable: false })(CartModel.prototype, 'id');
Field(() => String, { nullable: false })(CartModel.prototype, 'userId');
Field(() => [CartItemModel], { nullable: false })(CartModel.prototype, 'items');

module.exports = { CartModel, CartItemModel };
