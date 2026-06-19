import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { FortuneService } from './fortune.service';
import { Lang } from './fortune.content';

function today(): string {
  const n = new Date();
  return `${n.getUTCFullYear()}-${String(n.getUTCMonth() + 1).padStart(2, '0')}-${String(
    n.getUTCDate(),
  ).padStart(2, '0')}`;
}
function lang(v?: string): Lang {
  return v === 'km' ? 'km' : 'en';
}

@Controller('fortune')
export class FortuneController {
  constructor(private readonly fortune: FortuneService) {}

  @Get()
  daily(
    @Query('birth') birth?: string,
    @Query('date') date?: string,
    @Query('lang') l?: string,
  ) {
    if (!birth || !/^\d{4}-\d{2}-\d{2}$/.test(birth)) {
      throw new BadRequestException('birth must be YYYY-MM-DD');
    }
    return this.fortune.daily(birth, date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today(), lang(l));
  }

  @Get('compat')
  compat(@Query('a') a?: string, @Query('b') b?: string, @Query('lang') l?: string) {
    if (!a || !b) throw new BadRequestException('a and b are required');
    try {
      return this.fortune.compatibility(
        this.fortune.resolveAnimal(a),
        this.fortune.resolveAnimal(b),
        lang(l),
      );
    } catch {
      throw new BadRequestException('a and b must be an animal index (0-11) or YYYY-MM-DD');
    }
  }
}
