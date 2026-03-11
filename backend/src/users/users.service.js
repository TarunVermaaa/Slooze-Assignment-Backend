const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');

// service for user-related data operations
class UsersService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // fetch a single user by their ID
  async findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // fetch all users (admin use case)
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // fetch the currently authenticated user's profile
  async getProfile(userId) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}

Injectable()(UsersService);
Reflect.defineMetadata('design:paramtypes', [PrismaService], UsersService);

module.exports = { UsersService };
