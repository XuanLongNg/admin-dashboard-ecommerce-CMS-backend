import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`App listening on: http://localhost:${port}`);
}

bootstrap();
