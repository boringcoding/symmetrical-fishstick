import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile/profile.entity';
import { ProfileModule } from './profile/profile.module';
import { MoonModule } from './moon/moon.module';
import { InsightsModule } from './insights/insights.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url = process.env.DATABASE_URL;
        return {
          type: 'postgres' as const,
          url,
          autoLoadEntities: true,
          entities: [Profile],
          // MVP: auto-create schema. For production migrations, set to false.
          synchronize: true,
          ssl: url && !url.includes('localhost') ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    ProfileModule,
    MoonModule,
    InsightsModule,
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
