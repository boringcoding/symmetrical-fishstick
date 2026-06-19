import { Module } from '@nestjs/common';
import { KhmerService } from './khmer.service';

@Module({
  providers: [KhmerService],
  exports: [KhmerService],
})
export class KhmerModule {}
