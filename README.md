# Slooze - Food Ordering Backend

A role-based food ordering GraphQL API built with NestJS, Prisma, and PostgreSQL. The system enforces country-scoped access control so that Managers and Members can only interact with data from their own country, while Admins have unrestricted access.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Roles and Permissions](#roles-and-permissions)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Usage](#api-usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Seed Users](#seed-users)

---

## Features

- Role-Based Access Control (RBAC) with three roles: Admin, Manager, and Member
- Country-scoped data visibility for Managers and Members (India or America)
- GraphQL API with JWT authentication
- Pre-seeded test users and restaurant data

---

## Tech Stack

| Technology   | Purpose                              |
|--------------|--------------------------------------|
| Node.js      | Runtime environment                  |
| NestJS       | Application framework                |
| GraphQL      | API query language                   |
| Prisma       | ORM and database client              |
| PostgreSQL   | Relational database                  |
| JWT          | Authentication and authorization     |
| bcrypt       | Password hashing                     |

---

## Roles and Permissions

| Action                          | Admin | Manager | Member |
|---------------------------------|:-----:|:-------:|:------:|
| View restaurants and menu items |  Yes  |   Yes   |  Yes   |
| Create orders                   |  Yes  |   Yes   |  Yes   |
| Checkout and pay for orders     |  Yes  |   Yes   |   No   |
| Cancel orders                   |  Yes  |   Yes   |   No   |
| Add or modify payment methods   |  Yes  |   No    |   No   |

> Managers and Members only see restaurants and orders from their assigned country. Admins see all data regardless of country.

---

## Prerequisites

- Node.js v18 or later
- PostgreSQL
- npm (included with Node.js)

---

## Getting Started

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials and secrets (see [Environment Variables](#environment-variables)).

**4. Run database migrations**

```bash
npx prisma migrate dev --name init
```

**5. Seed the database**

```bash
npx prisma db seed
```

**6. Start the development server**

```bash
npm run start:dev
```

**7. Open the GraphQL Playground**

Navigate to [http://localhost:3000/graphql](http://localhost:3000/graphql) in your browser to explore and test the API interactively.

---

## Environment Variables

| Variable       | Description                                   | Example                                                        |
|----------------|-----------------------------------------------|----------------------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string                  | `postgresql://postgres:postgres@localhost:5432/slooz?schema=public` |
| `JWT_SECRET`   | Secret key used to sign JWT tokens            | `your-secret-key-here`                                         |
| `JWT_EXPIRES_IN` | Token expiry duration                       | `7d`                                                           |
| `PORT`         | Port the server listens on                    | `3000`                                                         |

---

## Database Setup

The project uses Prisma for schema management and migrations.

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev

# Seed test data
npx prisma db seed
```

---

## Running the Server

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm run start`      | Start the server in production mode  |
| `npm run start:dev`  | Start the server with hot-reload     |

---

## API Usage

All authenticated requests require the following HTTP header:

```
Authorization: Bearer <your-token>
```

### Authentication

**Login**

```graphql
mutation {
  login(input: { email: "nick@slooz.com", password: "password123" }) {
    token
    user {
      id
      name
      role
      country
    }
  }
}
```

Copy the returned `token` and include it in the `Authorization` header for all subsequent requests.

---

### Restaurants

**List restaurants and menu items**

```graphql
query {
  restaurants {
    id
    name
    country
    menuItems {
      id
      name
      price
    }
  }
}
```

---

### Orders

**Create an order**

```graphql
mutation {
  createOrder(input: {
    items: [
      { menuItemId: "mi-taj-1", quantity: 2 },
      { menuItemId: "mi-taj-3", quantity: 1 }
    ]
  }) {
    id
    status
    totalAmount
    items {
      menuItem { name }
      quantity
      price
    }
  }
}
```

**Checkout an order** *(Managers and Admins only)*

```graphql
mutation {
  checkout(input: {
    orderId: "<order-id>",
    paymentMethodId: "pm-nick-1"
  }) {
    id
    status
    paymentMethodId
  }
}
```

**Cancel an order** *(Managers and Admins only)*

```graphql
mutation {
  cancelOrder(orderId: "<order-id>") {
    id
    status
  }
}
```

---

### Payments

**Add a payment method** *(Admins only)*

```graphql
mutation {
  createPaymentMethod(input: {
    type: "CREDIT_CARD",
    details: "Mastercard ending in 8888"
  }) {
    id
    type
    details
  }
}
```

---

## Project Structure

```
backend/
  src/
    auth/           Authentication, JWT strategy, and guards
    users/          User accounts, roles, and country assignments
    restaurants/    Restaurant listings and menu items
    orders/         Order creation, cancellation, and checkout
    cart/           Shopping cart management
    payments/       Payment method management
    prisma/         Database client provider
    common/         Shared utilities and decorators
    app.module.js   Root application module
    main.js         Application entry point
  prisma/
    schema.prisma   Database schema definition
    seed.js         Test data seeding script
```

---

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Seed Users

The following users are created when you run the database seed. All accounts use the password `password123`.

| Name             | Email               | Role    | Country |
|------------------|---------------------|---------|---------|
| Nick Fury        | nick@slooz.com      | Admin   | -       |
| Captain Marvel   | marvel@slooz.com    | Manager | India   |
| Captain America  | america@slooz.com   | Manager | America |
| Thanos           | thanos@slooz.com    | Member  | India   |
| Thor             | thor@slooz.com      | Member  | India   |
| Travis           | travis@slooz.com    | Member  | America |
