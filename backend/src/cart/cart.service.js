const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');
const { GraphQLError } = require('graphql');
const { getCountryFilter } = require('../common/helpers/country-scope.helper');

// service for cart and cart item operations
class CartService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // get or create a cart for the given user
  async getOrCreateCart(userId) {
    // try to find the user's existing cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
    });

    // create a new cart if none exists
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { menuItem: true } } },
      });
    }

    return cart;
  }

  // fetch the current user's cart
  async getCart(userId) {
    return this.getOrCreateCart(userId);
  }

  // add a menu item to the user's cart
  async addToCart(userId, input, user) {
    // verify the menu item exists and belongs to the user's accessible country
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: input.menuItemId },
      include: { restaurant: true },
    });

    if (!menuItem) {
      throw new GraphQLError('Menu item not found');
    }

    // enforce country scoping for non-admin users
    const countryFilter = getCountryFilter(user);
    if (countryFilter.country && menuItem.restaurant.country !== countryFilter.country) {
      throw new GraphQLError('You cannot add items from restaurants outside your country');
    }

    // ensure the user has a cart
    const cart = await this.getOrCreateCart(userId);

    // upsert the cart item (increment quantity if already exists)
    try {
      await this.prisma.cartItem.upsert({
        where: { cartId_menuItemId: { cartId: cart.id, menuItemId: input.menuItemId } },
        update: { quantity: { increment: input.quantity } },
        create: {
          cartId: cart.id,
          menuItemId: input.menuItemId,
          quantity: input.quantity,
        },
      });
    } catch (err) {
      throw new GraphQLError('Failed to add item to cart');
    }

    // return the updated cart
    return this.getOrCreateCart(userId);
  }

  // update the quantity of a specific cart item
  async updateCartItem(userId, input) {
    // find the cart item and verify ownership
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: input.cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new GraphQLError('Cart item not found');
    }

    // if quantity is zero or less, remove the item
    if (input.quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: input.cartItemId } });
    } else {
      await this.prisma.cartItem.update({
        where: { id: input.cartItemId },
        data: { quantity: input.quantity },
      });
    }

    return this.getOrCreateCart(userId);
  }

  // remove a specific item from the cart
  async removeFromCart(userId, cartItemId) {
    // find the cart item and verify ownership
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new GraphQLError('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
    return this.getOrCreateCart(userId);
  }

  // clear all items from the user's cart
  async clearCart(userId) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return this.getOrCreateCart(userId);
  }
}

Injectable()(CartService);
Reflect.defineMetadata('design:paramtypes', [PrismaService], CartService);

module.exports = { CartService };
