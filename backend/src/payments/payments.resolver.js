const { Resolver, Query, Mutation, Args } = require('@nestjs/graphql');
const { PaymentsService } = require('./payments.service');
const { PaymentMethodModel } = require('./payments.model');
const { CreatePaymentMethodInput, UpdatePaymentMethodInput } = require('./payments.dto');
const { CurrentUser, Roles } = require('../common/decorators');
const { GraphQLBoolean } = require('graphql');

// resolver for payment method operations
class PaymentsResolver {
  constructor(paymentsService) {
    this.paymentsService = paymentsService;
  }

  // list the current user's payment methods
  async paymentMethods(user) {
    return this.paymentsService.getPaymentMethods(user.id);
  }

  // create a new payment method (admin only)
  async createPaymentMethod(input, user) {
    return this.paymentsService.createPaymentMethod(user.id, input);
  }

  // update an existing payment method (admin only)
  async updatePaymentMethod(input, user) {
    return this.paymentsService.updatePaymentMethod(user.id, input);
  }

  // delete a payment method (admin only)
  async deletePaymentMethod(id, user) {
    return this.paymentsService.deletePaymentMethod(user.id, id);
  }
}

Resolver(() => PaymentMethodModel)(PaymentsResolver);
Reflect.defineMetadata('design:paramtypes', [PaymentsService], PaymentsResolver);

// decorate paymentMethods query
Query(() => [PaymentMethodModel])(PaymentsResolver.prototype, 'paymentMethods', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'paymentMethods'));
CurrentUser()(PaymentsResolver.prototype, 'paymentMethods', 0);
Reflect.defineMetadata('design:paramtypes', [Object], PaymentsResolver.prototype, 'paymentMethods');

// decorate createPaymentMethod mutation (admin only)
Roles('ADMIN')(PaymentsResolver.prototype, 'createPaymentMethod', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'createPaymentMethod'));
Mutation(() => PaymentMethodModel)(PaymentsResolver.prototype, 'createPaymentMethod', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'createPaymentMethod'));
Args('input', { type: () => CreatePaymentMethodInput })(PaymentsResolver.prototype, 'createPaymentMethod', 0);
CurrentUser()(PaymentsResolver.prototype, 'createPaymentMethod', 1);
Reflect.defineMetadata('design:paramtypes', [CreatePaymentMethodInput, Object], PaymentsResolver.prototype, 'createPaymentMethod');

// decorate updatePaymentMethod mutation (admin only)
Roles('ADMIN')(PaymentsResolver.prototype, 'updatePaymentMethod', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'updatePaymentMethod'));
Mutation(() => PaymentMethodModel)(PaymentsResolver.prototype, 'updatePaymentMethod', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'updatePaymentMethod'));
Args('input', { type: () => UpdatePaymentMethodInput })(PaymentsResolver.prototype, 'updatePaymentMethod', 0);
CurrentUser()(PaymentsResolver.prototype, 'updatePaymentMethod', 1);
Reflect.defineMetadata('design:paramtypes', [UpdatePaymentMethodInput, Object], PaymentsResolver.prototype, 'updatePaymentMethod');

// decorate deletePaymentMethod mutation (admin only)
Roles('ADMIN')(PaymentsResolver.prototype, 'deletePaymentMethod', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'deletePaymentMethod'));
Mutation(() => GraphQLBoolean)(PaymentsResolver.prototype, 'deletePaymentMethod', Object.getOwnPropertyDescriptor(PaymentsResolver.prototype, 'deletePaymentMethod'));
Args('id', { type: () => String })(PaymentsResolver.prototype, 'deletePaymentMethod', 0);
CurrentUser()(PaymentsResolver.prototype, 'deletePaymentMethod', 1);
Reflect.defineMetadata('design:paramtypes', [String, Object], PaymentsResolver.prototype, 'deletePaymentMethod');

module.exports = { PaymentsResolver };
