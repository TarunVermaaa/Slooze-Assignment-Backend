require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');
const { ConfigService } = require('@nestjs/config');
const { Logger } = require('@nestjs/common');

const logger = new Logger('Bootstrap');

// bootstrap the NestJS application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable CORS for development
  app.enableCors();

  // read port from env or default to 3000
  const config = app.get(ConfigService);
  const port = config.get('PORT', 3000);

  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}/graphql`);
}

bootstrap();
