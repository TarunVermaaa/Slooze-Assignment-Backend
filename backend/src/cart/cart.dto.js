const { InputType, Field, Int } = require('@nestjs/graphql');

// input for adding an item to the cart
class AddToCartInput {}

InputType()(AddToCartInput);
Field(() => String, { nullable: false })(AddToCartInput.prototype, 'menuItemId');
Field(() => Int, { nullable: false, defaultValue: 1 })(AddToCartInput.prototype, 'quantity');

// input for updating quantity of a cart item
class UpdateCartItemInput {}

InputType()(UpdateCartItemInput);
Field(() => String, { nullable: false })(UpdateCartItemInput.prototype, 'cartItemId');
Field(() => Int, { nullable: false })(UpdateCartItemInput.prototype, 'quantity');

module.exports = { AddToCartInput, UpdateCartItemInput };
