import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthService } from './auth.service';
import { ProfileService } from '../profile/profile.service';

class TelegramLoginDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsNumber()
  auth_date: number;

  @IsString()
  hash: string;

  // If the visitor already has an anonymous local profile, link it.
  @IsOptional()
  @IsString()
  linkProfileId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly profiles: ProfileService,
  ) {}

  @Get('config')
  config() {
    return { telegram: this.auth.enabled, bot: this.auth.publicBot };
  }

  @Post('telegram')
  async telegram(@Body() dto: TelegramLoginDto) {
    const { linkProfileId, ...data } = dto;
    const identity = this.auth.verifyTelegram(data);

    // 1. Existing account → return its profile.
    const existing = await this.profiles.findByAuthSub(identity.sub);
    if (existing) {
      return { profile: existing, prefill: null };
    }

    // 2. Link an anonymous profile created during this session.
    if (linkProfileId) {
      const linked = await this.profiles.linkAuth(linkProfileId, {
        sub: identity.sub,
        provider: identity.provider,
        username: identity.username,
        avatarUrl: identity.avatarUrl,
      });
      return { profile: linked, prefill: null };
    }

    // 3. New user → onboard with prefilled details.
    return {
      profile: null,
      prefill: { name: identity.name, username: identity.username, avatarUrl: identity.avatarUrl },
    };
  }
}
