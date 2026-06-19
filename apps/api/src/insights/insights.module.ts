import { Module } from '@nestjs/common';
import { MoonModule } from '../moon/moon.module';
import { ProfileModule } from '../profile/profile.module';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';

@Module({
  imports: [MoonModule, ProfileModule],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
