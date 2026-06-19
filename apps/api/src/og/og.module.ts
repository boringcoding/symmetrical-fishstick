import { Module } from '@nestjs/common';
import { OgService } from './og.service';
import { OgController } from './og.controller';

@Module({
  controllers: [OgController],
  providers: [OgService],
})
export class OgModule {}
