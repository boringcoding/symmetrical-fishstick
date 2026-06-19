import { Module } from '@nestjs/common';
import { MoonService } from './moon.service';
import { MoonController } from './moon.controller';
import { KhmerModule } from '../khmer/khmer.module';

@Module({
  imports: [KhmerModule],
  controllers: [MoonController],
  providers: [MoonService],
  exports: [MoonService],
})
export class MoonModule {}
