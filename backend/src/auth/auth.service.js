const { Injectable } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { PrismaService } = require('../prisma/prisma.service');
const bcrypt = require('bcrypt');
const { GraphQLError } = require('graphql');

const SALT_ROUNDS = 10;

// handles user registration and login
class AuthService {
  constructor(prisma, jwt) {
    this.prisma = prisma;
    this.jwt = jwt;
  }

  // register a new user with hashed password
  async register(input) {
    // check if a user with the same email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new GraphQLError('A user with this email already exists');
    }

    // hash the password before storing
    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    // create the user record
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role || 'MEMBER',
        country: input.country || null,
      },
    });

    // generate and return a JWT token
    const token = this.generateToken(user);
    return { token, user };
  }

  // authenticate a user with email and password
  async login(email, password) {
    // look up the user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new GraphQLError('Invalid email or password');
    }

    // verify the password against the stored hash
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new GraphQLError('Invalid email or password');
    }

    // generate and return a JWT token
    const token = this.generateToken(user);
    return { token, user };
  }

  // create a signed JWT with user identity claims
  generateToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
      country: user.country,
    };

    return this.jwt.sign(payload);
  }
}

Injectable()(AuthService);
Reflect.defineMetadata('design:paramtypes', [PrismaService, JwtService], AuthService);

module.exports = { AuthService };
