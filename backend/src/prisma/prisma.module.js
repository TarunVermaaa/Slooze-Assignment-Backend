const { Module, Global } = require('@nestjs/common');
const { PrismaService } = require('./prisma.service');

// global module so PrismaService is available everywhere without re-importing
class PrismaModule {}

Global()(PrismaModule);
Module({
  providers: [PrismaService],
  exports: [PrismaService],
})(PrismaModule);

module.exports = { PrismaModule };
