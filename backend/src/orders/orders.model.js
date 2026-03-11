const { ObjectType, Field, ID, Float, Int } = require('@nestjs/graphql');
const { MenuItemModel } = require('../restaurants/restaurants.model');

// GraphQL object type for an individual order line item
class OrderItemModel {}

ObjectType('OrderItem')(OrderItemModel);
Field(() => ID, { nullable: false })(OrderItemModel.prototype, 'id');
Field(() => String, { nullable: false })(OrderItemModel.prototype, 'menuItemId');
Field(() => Int, { nullable: false })(OrderItemModel.prototype, 'quantity');
Field(() => Float, { nullable: false })(OrderItemModel.prototype, 'price');
Field(() => MenuItemModel, { nullable: false })(OrderItemModel.prototype, 'menuItem');

// GraphQL object type representing a full order
class OrderModel {}

ObjectType('Order')(OrderModel);
Field(() => ID, { nullable: false })(OrderModel.prototype, 'id');
Field(() => String, { nullable: false })(OrderModel.prototype, 'userId');
Field(() => String, { nullable: false })(OrderModel.prototype, 'status');
Field(() => Float, { nullable: false })(OrderModel.prototype, 'totalAmount');
Field(() => String, { nullable: true })(OrderModel.prototype, 'paymentMethodId');
Field(() => String, { nullable: false })(OrderModel.prototype, 'country');
Field(() => [OrderItemModel], { nullable: false })(OrderModel.prototype, 'items');
Field(() => String, { nullable: false })(OrderModel.prototype, 'createdAt');

module.exports = { OrderModel, OrderItemModel };
