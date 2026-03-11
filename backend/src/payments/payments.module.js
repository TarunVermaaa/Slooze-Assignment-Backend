const { Module } = require('@nestjs/common');
const { PaymentsService } = require('./payments.service');
const { PaymentsResolver } = require('./payments.resolver');

// module for payment method management
class PaymentsModule {}

Module({
  providers: [PaymentsService, PaymentsResolver],
  exports: [PaymentsService],
})(PaymentsModule);

module.exports = { PaymentsModule };
