import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('app.database'),
        entities: ['dist/**/*.entity.{js,ts}'],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
