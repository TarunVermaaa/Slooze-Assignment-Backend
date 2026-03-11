const { Resolver, Query, Mutation, Args } = require('@nestjs/graphql');
const { OrdersService } = require('./orders.service');
const { OrdersCheckoutService } = require('./orders.checkout.service');
const { OrderModel } = require('./orders.model');
const { CreateOrderInput, CheckoutInput } = require('./orders.dto');
const { CurrentUser, Roles } = require('../common/decorators');

// resolver for order operations
class OrdersResolver {
  constructor(ordersService, checkoutService) {
    this.ordersService = ordersService;
    this.checkoutService = checkoutService;
  }

  // list all orders visible to the current user
  async orders(user) {
    return this.ordersService.getOrders(user);
  }

  // get a single order by ID
  async order(id, user) {
    return this.ordersService.getOrderById(id, user);
  }

  // create a new order from item inputs
  async createOrder(input, user) {
    return this.ordersService.createOrder(user.id, input, user);
  }

  // checkout an order with a payment method (admin and manager only)
  async checkout(input, user) {
    return this.checkoutService.checkout(user.id, input, user);
  }

  // cancel a pending order (admin and manager only)
  async cancelOrder(orderId, user) {
    return this.checkoutService.cancelOrder(orderId, user.id, user);
  }
}

Resolver(() => OrderModel)(OrdersResolver);
Reflect.defineMetadata(
  'design:paramtypes',
  [OrdersService, OrdersCheckoutService],
  OrdersResolver,
);

// decorate orders query
Query(() => [OrderModel])(OrdersResolver.prototype, 'orders', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'orders'));
CurrentUser()(OrdersResolver.prototype, 'orders', 0);
Reflect.defineMetadata('design:paramtypes', [Object], OrdersResolver.prototype, 'orders');

// decorate order query
Query(() => OrderModel, { nullable: true })(OrdersResolver.prototype, 'order', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'order'));
Args('id', { type: () => String })(OrdersResolver.prototype, 'order', 0);
CurrentUser()(OrdersResolver.prototype, 'order', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], OrdersResolver.prototype, 'order');

// decorate createOrder mutation
Mutation(() => OrderModel)(OrdersResolver.prototype, 'createOrder', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'createOrder'));
Args('input', { type: () => CreateOrderInput })(OrdersResolver.prototype, 'createOrder', 0);
CurrentUser()(OrdersResolver.prototype, 'createOrder', 1);
Reflect.defineMetadata('design:paramtypes', [CreateOrderInput, Object], OrdersResolver.prototype, 'createOrder');

// decorate checkout mutation (admin and manager only)
Roles('ADMIN', 'MANAGER')(OrdersResolver.prototype, 'checkout', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'checkout'));
Mutation(() => OrderModel)(OrdersResolver.prototype, 'checkout', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'checkout'));
Args('input', { type: () => CheckoutInput })(OrdersResolver.prototype, 'checkout', 0);
CurrentUser()(OrdersResolver.prototype, 'checkout', 1);
Reflect.defineMetadata('design:paramtypes', [CheckoutInput, Object], OrdersResolver.prototype, 'checkout');

// decorate cancelOrder mutation (admin and manager only)
Roles('ADMIN', 'MANAGER')(OrdersResolver.prototype, 'cancelOrder', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'cancelOrder'));
Mutation(() => OrderModel)(OrdersResolver.prototype, 'cancelOrder', Object.getOwnPropertyDescriptor(OrdersResolver.prototype, 'cancelOrder'));
Args('orderId', { type: () => String })(OrdersResolver.prototype, 'cancelOrder', 0);
CurrentUser()(OrdersResolver.prototype, 'cancelOrder', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], OrdersResolver.prototype, 'cancelOrder');

module.exports = { OrdersResolver };
