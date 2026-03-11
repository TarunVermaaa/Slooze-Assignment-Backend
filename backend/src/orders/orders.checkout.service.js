const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');
const { GraphQLError } = require('graphql');

// service for order checkout and cancellation operations
class OrdersCheckoutService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // checkout an order by associating a payment method and confirming it
  async checkout(userId, input, user) {
    // fetch the order and verify it belongs to the requesting user
    const order = await this.prisma.order.findUnique({
      where: { id: input.orderId },
    });

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    if (order.userId !== userId) {
      throw new GraphQLError('You do not have permission to checkout this order');
    }

    // only pending orders can be checked out
    if (order.status !== 'PENDING') {
      throw new GraphQLError('Only pending orders can be checked out');
    }

    // verify the payment method exists and belongs to the user (or admin)
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: input.paymentMethodId },
    });

    if (!paymentMethod) {
      throw new GraphQLError('Payment method not found');
    }

    if (paymentMethod.userId !== userId && user.role !== 'ADMIN') {
      throw new GraphQLError('You cannot use a payment method that does not belong to you');
    }

    // update the order status and link the payment method in a transaction
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      return tx.order.update({
        where: { id: input.orderId },
        data: {
          status: 'CONFIRMED',
          paymentMethodId: input.paymentMethodId,
        },
        include: { items: { include: { menuItem: true } } },
      });
    });

    return updatedOrder;
  }

  // cancel a pending order
  async cancelOrder(orderId, userId, user) {
    // fetch the order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new GraphQLError('Order not found');
    }

    // admin can cancel any order; others can only cancel their own
    if (user.role !== 'ADMIN' && order.userId !== userId) {
      throw new GraphQLError('You do not have permission to cancel this order');
    }

    // only pending or confirmed orders can be cancelled
    if (order.status === 'CANCELLED') {
      throw new GraphQLError('This order is already cancelled');
    }

    // update the order status to cancelled
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: { include: { menuItem: true } } },
    });
  }
}

Injectable()(OrdersCheckoutService);
Reflect.defineMetadata('design:paramtypes', [PrismaService], OrdersCheckoutService);

module.exports = { OrdersCheckoutService };
