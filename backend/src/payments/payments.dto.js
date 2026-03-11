const { InputType, Field } = require('@nestjs/graphql');

// input for creating a new payment method
class CreatePaymentMethodInput {}

InputType()(CreatePaymentMethodInput);
Field(() => String, { nullable: false })(CreatePaymentMethodInput.prototype, 'type');
Field(() => String, { nullable: false })(CreatePaymentMethodInput.prototype, 'details');

// input for updating an existing payment method
class UpdatePaymentMethodInput {}

InputType()(UpdatePaymentMethodInput);
Field(() => String, { nullable: false })(UpdatePaymentMethodInput.prototype, 'id');
Field(() => String, { nullable: true })(UpdatePaymentMethodInput.prototype, 'type');
Field(() => String, { nullable: true })(UpdatePaymentMethodInput.prototype, 'details');

module.exports = { CreatePaymentMethodInput, UpdatePaymentMethodInput };
