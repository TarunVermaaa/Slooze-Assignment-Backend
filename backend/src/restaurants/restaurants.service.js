const { Injectable } = require('@nestjs/common');
const { PrismaService } = require('../prisma/prisma.service');
const { getCountryFilter } = require('../common/helpers/country-scope.helper');

// service for restaurant and menu item data operations
class RestaurantsService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // fetch all restaurants scoped to the requesting user's country
  async findAll(user) {
    // build country filter based on user role
    const countryFilter = getCountryFilter(user);

    return this.prisma.restaurant.findMany({
      where: countryFilter,
      include: { menuItems: true },
      orderBy: { name: 'asc' },
    });
  }

  // fetch a single restaurant by ID with country scoping
  async findById(id, user) {
    const countryFilter = getCountryFilter(user);

    // combine the ID filter with the country scope
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id, ...countryFilter },
      include: { menuItems: true },
    });

    return restaurant;
  }

  // fetch all menu items for a specific restaurant with country scoping
  async getMenuItems(restaurantId, user) {
    const countryFilter = getCountryFilter(user);

    // verify the restaurant is accessible to this user
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id: restaurantId, ...countryFilter },
    });

    if (!restaurant) {
      return [];
    }

    return this.prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { name: 'asc' },
    });
  }
}

Injectable()(RestaurantsService);
Reflect.defineMetadata('design:paramtypes', [PrismaService], RestaurantsService);

module.exports = { RestaurantsService };
