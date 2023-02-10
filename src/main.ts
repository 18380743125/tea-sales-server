import { NestFactory } from '@nestjs/core';
import { AppConfig } from './common/enum/config.enum';
import configuration from './configuration';
import { AppModule } from './app.module';
import setup from './setup'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig: Record<string, any> = configuration()['app'];

  app.setGlobalPrefix('/api/v1');

  setup(app)

  await app.listen(appConfig[AppConfig.PORT]);
}
bootstrap();
