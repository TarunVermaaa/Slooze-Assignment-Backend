const { Injectable } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const { ConfigService } = require('@nestjs/config');
const { PrismaService } = require('../prisma/prisma.service');

// passport strategy that validates JWT tokens from the Authorization header
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config, prisma) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
    this.prisma = prisma;
  }

  // called after token is verified; attaches user info to the request
  async validate(payload) {
    // look up the user to ensure they still exist
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    // return a clean user object for the request context
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
    };
  }
}

Injectable()(JwtStrategy);
Reflect.defineMetadata('design:paramtypes', [ConfigService, PrismaService], JwtStrategy);

module.exports = { JwtStrategy };
