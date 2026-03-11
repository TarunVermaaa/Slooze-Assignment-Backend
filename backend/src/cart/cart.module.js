const { Module } = require('@nestjs/common');
const { CartService } = require('./cart.service');
const { CartResolver } = require('./cart.resolver');

// module for cart management operations
class CartModule {}

Module({
  providers: [CartService, CartResolver],
  exports: [CartService],
})(CartModule);

module.exports = { CartModule };
