const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');
const { GraphQLError } = require('graphql');

// service for payment method management (admin only for write operations)
class PaymentsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // list all payment methods for a given user
  async getPaymentMethods(userId) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // create a new payment method for the requesting user
  async createPaymentMethod(userId, input) {
    try {
      return await this.prisma.paymentMethod.create({
        data: {
          userId,
          type: input.type,
          details: input.details,
        },
      });
    } catch (err) {
      throw new GraphQLError('Failed to create payment method');
    }
  }

  // update an existing payment method
  async updatePaymentMethod(userId, input) {
    // verify the payment method exists and belongs to the user
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id: input.id },
    });

    if (!method) {
      throw new GraphQLError('Payment method not found');
    }

    if (method.userId !== userId) {
      throw new GraphQLError('You do not have permission to modify this payment method');
    }

    // build the update data from provided fields
    const updateData = {};
    if (input.type) updateData.type = input.type;
    if (input.details) updateData.details = input.details;

    return this.prisma.paymentMethod.update({
      where: { id: input.id },
      data: updateData,
    });
  }

  // delete a payment method
  async deletePaymentMethod(userId, paymentMethodId) {
    // verify ownership
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!method) {
      throw new GraphQLError('Payment method not found');
    }

    if (method.userId !== userId) {
      throw new GraphQLError('You do not have permission to delete this payment method');
    }

    await this.prisma.paymentMethod.delete({ where: { id: paymentMethodId } });
    return true;
  }
}

Injectable()(PaymentsService);
Reflect.defineMetadata('design:paramtypes', [PrismaService], PaymentsService);

module.exports = { PaymentsService };
