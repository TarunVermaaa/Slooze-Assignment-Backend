const { Resolver, Query, Mutation, Args } = require('@nestjs/graphql');
const { CartService } = require('./cart.service');
const { CartModel } = require('./cart.model');
const { AddToCartInput, UpdateCartItemInput } = require('./cart.dto');
const { CurrentUser } = require('../common/decorators');

// resolver for cart operations
class CartResolver {
  constructor(cartService) {
    this.cartService = cartService;
  }

  // get the current user's cart
  async cart(user) {
    return this.cartService.getCart(user.id);
  }

  // add an item to the cart
  async addToCart(input, user) {
    return this.cartService.addToCart(user.id, input, user);
  }

  // update quantity of an existing cart item
  async updateCartItem(input, user) {
    return this.cartService.updateCartItem(user.id, input);
  }

  // remove a specific item from the cart
  async removeFromCart(cartItemId, user) {
    return this.cartService.removeFromCart(user.id, cartItemId);
  }

  // clear all items from the cart
  async clearCart(user) {
    return this.cartService.clearCart(user.id);
  }
}

Resolver(() => CartModel)(CartResolver);
Reflect.defineMetadata('design:paramtypes', [CartService], CartResolver);

// decorate cart query
Query(() => CartModel)(CartResolver.prototype, 'cart', Object.getOwnPropertyDescriptor(CartResolver.prototype, 'cart'));
CurrentUser()(CartResolver.prototype, 'cart', 0);
Reflect.defineMetadata('design:paramtypes', [Object], CartResolver.prototype, 'cart');

// decorate addToCart mutation
Mutation(() => CartModel)(CartResolver.prototype, 'addToCart', Object.getOwnPropertyDescriptor(CartResolver.prototype, 'addToCart'));
Args('input', { type: () => AddToCartInput })(CartResolver.prototype, 'addToCart', 0);
CurrentUser()(CartResolver.prototype, 'addToCart', 1);
Reflect.defineMetadata('design:paramtypes', [AddToCartInput, Object], CartResolver.prototype, 'addToCart');

// decorate updateCartItem mutation
Mutation(() => CartModel)(CartResolver.prototype, 'updateCartItem', Object.getOwnPropertyDescriptor(CartResolver.prototype, 'updateCartItem'));
Args('input', { type: () => UpdateCartItemInput })(CartResolver.prototype, 'updateCartItem', 0);
CurrentUser()(CartResolver.prototype, 'updateCartItem', 1);
Reflect.defineMetadata('design:paramtypes', [UpdateCartItemInput, Object], CartResolver.prototype, 'updateCartItem');

// decorate removeFromCart mutation
Mutation(() => CartModel)(CartResolver.prototype, 'removeFromCart', Object.getOwnPropertyDescriptor(CartResolver.prototype, 'removeFromCart'));
Args('cartItemId', { type: () => String })(CartResolver.prototype, 'removeFromCart', 0);
CurrentUser()(CartResolver.prototype, 'removeFromCart', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], CartResolver.prototype, 'removeFromCart');

// decorate clearCart mutation
Mutation(() => CartModel)(CartResolver.prototype, 'clearCart', Object.getOwnPropertyDescriptor(CartResolver.prototype, 'clearCart'));
CurrentUser()(CartResolver.prototype, 'clearCart', 0);
Reflect.defineMetadata('design:paramtypes', [Object], CartResolver.prototype, 'clearCart');

module.exports = { CartResolver };
