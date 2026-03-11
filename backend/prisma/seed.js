const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'password123';

// seed the database with initial users, restaurants, and menu items
async function main() {
  // hash the default password once for all users
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // seed the six required users
  const users = [
    { name: 'Nick Fury', email: 'nick@slooz.com', role: 'ADMIN', country: null },
    { name: 'Captain Marvel', email: 'marvel@slooz.com', role: 'MANAGER', country: 'INDIA' },
    { name: 'Captain America', email: 'america@slooz.com', role: 'MANAGER', country: 'AMERICA' },
    { name: 'Thanos', email: 'thanos@slooz.com', role: 'MEMBER', country: 'INDIA' },
    { name: 'Thor', email: 'thor@slooz.com', role: 'MEMBER', country: 'INDIA' },
    { name: 'Travis', email: 'travis@slooz.com', role: 'MEMBER', country: 'AMERICA' },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        country: userData.country,
      },
    });
  }

  // seed Indian restaurants
  const tajMahal = await prisma.restaurant.upsert({
    where: { id: 'rest-india-1' },
    update: {},
    create: {
      id: 'rest-india-1',
      name: 'Taj Mahal Kitchen',
      country: 'INDIA',
      address: '12 Connaught Place, New Delhi',
    },
  });

  const spiceGarden = await prisma.restaurant.upsert({
    where: { id: 'rest-india-2' },
    update: {},
    create: {
      id: 'rest-india-2',
      name: 'Spice Garden',
      country: 'INDIA',
      address: '45 Marine Drive, Mumbai',
    },
  });

  // seed American restaurants
  const burgerBarn = await prisma.restaurant.upsert({
    where: { id: 'rest-usa-1' },
    update: {},
    create: {
      id: 'rest-usa-1',
      name: 'Burger Barn',
      country: 'AMERICA',
      address: '200 Broadway, New York',
    },
  });

  const steakHouse = await prisma.restaurant.upsert({
    where: { id: 'rest-usa-2' },
    update: {},
    create: {
      id: 'rest-usa-2',
      name: 'Liberty Steak House',
      country: 'AMERICA',
      address: '88 Sunset Blvd, Los Angeles',
    },
  });

  // seed menu items for Taj Mahal Kitchen
  const tajItems = [
    { id: 'mi-taj-1', name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 350, restaurantId: tajMahal.id },
    { id: 'mi-taj-2', name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 280, restaurantId: tajMahal.id },
    { id: 'mi-taj-3', name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter gravy', price: 220, restaurantId: tajMahal.id },
    { id: 'mi-taj-4', name: 'Garlic Naan', description: 'Freshly baked flatbread with garlic', price: 60, restaurantId: tajMahal.id },
  ];

  // seed menu items for Spice Garden
  const spiceItems = [
    { id: 'mi-spice-1', name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken', price: 320, restaurantId: spiceGarden.id },
    { id: 'mi-spice-2', name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potatoes', price: 150, restaurantId: spiceGarden.id },
    { id: 'mi-spice-3', name: 'Chole Bhature', description: 'Chickpea curry served with fried bread', price: 180, restaurantId: spiceGarden.id },
    { id: 'mi-spice-4', name: 'Mango Lassi', description: 'Sweet yogurt drink blended with mango', price: 90, restaurantId: spiceGarden.id },
    { id: 'mi-spice-5', name: 'Gulab Jamun', description: 'Deep-fried milk dumplings in sugar syrup', price: 100, restaurantId: spiceGarden.id },
  ];

  // seed menu items for Burger Barn
  const burgerItems = [
    { id: 'mi-burger-1', name: 'Classic Cheeseburger', description: 'Beef patty with cheddar, lettuce, and tomato', price: 12.99, restaurantId: burgerBarn.id },
    { id: 'mi-burger-2', name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce with crispy bacon strips', price: 14.99, restaurantId: burgerBarn.id },
    { id: 'mi-burger-3', name: 'Loaded Fries', description: 'Crispy fries topped with cheese and jalapenos', price: 8.99, restaurantId: burgerBarn.id },
    { id: 'mi-burger-4', name: 'Milkshake', description: 'Thick vanilla milkshake with whipped cream', price: 6.99, restaurantId: burgerBarn.id },
  ];

  // seed menu items for Liberty Steak House
  const steakItems = [
    { id: 'mi-steak-1', name: 'Ribeye Steak', description: 'Prime 12oz ribeye grilled to perfection', price: 34.99, restaurantId: steakHouse.id },
    { id: 'mi-steak-2', name: 'Caesar Salad', description: 'Romaine lettuce with parmesan and croutons', price: 11.99, restaurantId: steakHouse.id },
    { id: 'mi-steak-3', name: 'Grilled Salmon', description: 'Atlantic salmon with lemon herb butter', price: 28.99, restaurantId: steakHouse.id },
    { id: 'mi-steak-4', name: 'Mashed Potatoes', description: 'Creamy garlic mashed potatoes', price: 7.99, restaurantId: steakHouse.id },
    { id: 'mi-steak-5', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center', price: 9.99, restaurantId: steakHouse.id },
  ];

  // upsert all menu items
  const allItems = [...tajItems, ...spiceItems, ...burgerItems, ...steakItems];
  for (const item of allItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // create payment methods for Nick Fury (admin)
  const nickFury = await prisma.user.findUnique({ where: { email: 'nick@slooz.com' } });
  if (nickFury) {
    await prisma.paymentMethod.upsert({
      where: { id: 'pm-nick-1' },
      update: {},
      create: {
        id: 'pm-nick-1',
        userId: nickFury.id,
        type: 'CREDIT_CARD',
        details: 'Visa ending in 4242',
      },
    });

    await prisma.paymentMethod.upsert({
      where: { id: 'pm-nick-2' },
      update: {},
      create: {
        id: 'pm-nick-2',
        userId: nickFury.id,
        type: 'UPI',
        details: 'nick@upi',
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
