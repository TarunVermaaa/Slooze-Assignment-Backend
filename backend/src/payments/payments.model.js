const { ObjectType, Field, ID } = require('@nestjs/graphql');

// GraphQL object type representing a payment method
class PaymentMethodModel {}

ObjectType('PaymentMethod')(PaymentMethodModel);
Field(() => ID, { nullable: false })(PaymentMethodModel.prototype, 'id');
Field(() => String, { nullable: false })(PaymentMethodModel.prototype, 'userId');
Field(() => String, { nullable: false })(PaymentMethodModel.prototype, 'type');
Field(() => String, { nullable: false })(PaymentMethodModel.prototype, 'details');
Field(() => String, { nullable: false })(PaymentMethodModel.prototype, 'createdAt');

module.exports = { PaymentMethodModel };
