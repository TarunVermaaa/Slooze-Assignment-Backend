const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');
const { GraphQLError } = require('graphql');
const { getCountryFilter } = require('../common/helpers/country-scope.helper');

// service for order creation and listing
class OrdersService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // create a new order from a list of item inputs
  async createOrder(userId, input, user) {
    // determine the country for this order
    const orderCountry = user.country || 'INDIA';

    // fetch all requested menu items with their restaurant info
    const menuItemIds = input.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      include: { restaurant: true },
    });

    // verify all items were found
    if (menuItems.length !== menuItemIds.length) {
      throw new GraphQLError('One or more menu items not found');
    }

    // enforce country scoping on each menu item
    const countryFilter = getCountryFilter(user);
    if (countryFilter.country) {
      const crossCountry = menuItems.find(
        (mi) => mi.restaurant.country !== countryFilter.country,
      );
      if (crossCountry) {
        throw new GraphQLError('You cannot order items from restaurants outside your country');
      }
    }

    // build order items with prices and compute total
    const orderItems = input.items.map((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

    // create the order with nested order items
    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        totalAmount,
        country: orderCountry,
        items: { create: orderItems },
      },
      include: { items: { include: { menuItem: true } } },
    });

    return order;
  }

  // list orders visible to the current user
  async getOrders(user) {
    const countryFilter = getCountryFilter(user);

    // admin sees all orders; others see only their own
    const whereClause = user.role === 'ADMIN'
      ? { ...countryFilter }
      : { userId: user.id, ...countryFilter };

    return this.prisma.order.findMany({
      where: whereClause,
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // fetch a single order by ID with access control
  async getOrderById(orderId, user) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } } },
    });

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    // non-admin users can only view their own orders
    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      throw new GraphQLError('You do not have permission to view this order');
    }

    return order;
  }
}

Injectable()(OrdersService);
Reflect.defineMetadata('design:paramtypes', [PrismaService], OrdersService);

module.exports = { OrdersService };
