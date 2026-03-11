const { InputType, Field, Int } = require('@nestjs/graphql');

// input for adding a single item when creating an order
class OrderItemInput {}

InputType()(OrderItemInput);
Field(() => String, { nullable: false })(OrderItemInput.prototype, 'menuItemId');
Field(() => Int, { nullable: false, defaultValue: 1 })(OrderItemInput.prototype, 'quantity');

// input for creating a new order with items
class CreateOrderInput {}

InputType()(CreateOrderInput);
Field(() => [OrderItemInput], { nullable: false })(CreateOrderInput.prototype, 'items');

// input for checking out an order (finalizing payment)
class CheckoutInput {}

InputType()(CheckoutInput);
Field(() => String, { nullable: false })(CheckoutInput.prototype, 'orderId');
Field(() => String, { nullable: false })(CheckoutInput.prototype, 'paymentMethodId');

module.exports = { OrderItemInput, CreateOrderInput, CheckoutInput };
