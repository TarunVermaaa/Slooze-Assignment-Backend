const { Module } = require('@nestjs/common');
const { OrdersService } = require('./orders.service');
const { OrdersCheckoutService } = require('./orders.checkout.service');
const { OrdersResolver } = require('./orders.resolver');

// module for order creation, checkout, and cancellation
class OrdersModule {}

Module({
  providers: [OrdersService, OrdersCheckoutService, OrdersResolver],
  exports: [OrdersService],
})(OrdersModule);

module.exports = { OrdersModule };
