import { Controller, Get, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackVisitDto } from './dto/analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  async trackVisit(@Body() data: TrackVisitDto) {
    if (!data.path || !data.sessionId) {
      return { success: false, error: 'Missing path or sessionId' };
    }
    return this.analyticsService.trackVisit(data.path, data.sessionId);
  }

  @Get('stats')
  async getStats() {
    return this.analyticsService.getStats();
  }

  @Get('ai')
  async getAiStats() {
    return this.analyticsService.getAiStats();
  }
}
