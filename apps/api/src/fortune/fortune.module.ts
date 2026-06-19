import { Module } from '@nestjs/common';
import { FortuneService } from './fortune.service';
import { FortuneController } from './fortune.controller';
import { KhmerModule } from '../khmer/khmer.module';

@Module({
  imports: [KhmerModule],
  controllers: [FortuneController],
  providers: [FortuneService],
  exports: [FortuneService],
})
export class FortuneModule {}
