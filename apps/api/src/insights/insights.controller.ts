import { Controller, Get, Param, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insights: InsightsService) {}

  @Get(':profileId')
  forProfile(@Param('profileId') profileId: string, @Query('date') date?: string) {
    return this.insights.forProfile(profileId, date);
  }
}
