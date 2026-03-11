require('reflect-metadata');
const { Injectable } = require('@nestjs/common');
const { PrismaClient } = require('@prisma/client');

// singleton wrapper around PrismaClient for NestJS dependency injection
class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  // connect to the database when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // disconnect cleanly when the app shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

Injectable()(PrismaService);

module.exports = { PrismaService };
