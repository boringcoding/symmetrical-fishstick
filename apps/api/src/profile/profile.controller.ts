import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profiles.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profiles.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.profiles.update(id, dto);
  }
}
