import { Controller, Get, Query } from '@nestjs/common';
import { MoonService } from './moon.service';

@Controller('moon')
export class MoonController {
  constructor(private readonly moon: MoonService) {}

  @Get('day')
  day(
    @Query('date') date?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('tz') tz?: string,
  ) {
    const d = parseDate(date);
    return this.moon.computeDay({
      ...d,
      lat: lat != null ? Number(lat) : undefined,
      lng: lng != null ? Number(lng) : undefined,
      tzOffsetMin: tz != null ? Number(tz) : 0,
      withRiseSet: lat != null && lng != null,
    });
  }

  @Get('month')
  month(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('tz') tz?: string,
  ) {
    const now = new Date();
    return this.moon.computeMonth({
      year: year != null ? Number(year) : now.getUTCFullYear(),
      month: month != null ? Number(month) : now.getUTCMonth() + 1,
      lat: lat != null ? Number(lat) : undefined,
      lng: lng != null ? Number(lng) : undefined,
      tzOffsetMin: tz != null ? Number(tz) : 0,
    });
  }
}

function parseDate(date?: string): { year: number; month: number; day: number } {
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split('-').map(Number);
    return { year: y, month: m, day: d };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1, day: now.getUTCDate() };
}
