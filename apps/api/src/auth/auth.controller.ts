import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { AuthService } from './auth.service';
import { ProfileService } from '../profile/profile.service';

class GoogleLoginDto {
  @IsString()
  idToken: string;

  // If the visitor already has an anonymous local profile, link it to the account.
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
    return { google: this.auth.enabled };
  }

  @Post('google')
  async google(@Body() dto: GoogleLoginDto) {
    const identity = await this.auth.verifyGoogle(dto.idToken);

    // 1. Existing account → return its profile.
    const existing = await this.profiles.findByGoogleSub(identity.sub);
    if (existing) {
      return { profile: existing, prefill: null };
    }

    // 2. Link an anonymous profile created during this session.
    if (dto.linkProfileId) {
      const linked = await this.profiles.linkGoogle(dto.linkProfileId, {
        sub: identity.sub,
        email: identity.email,
        avatarUrl: identity.picture,
      });
      return { profile: linked, prefill: null };
    }

    // 3. Brand new user → let the client onboard with prefilled details.
    return {
      profile: null,
      prefill: { name: identity.name, email: identity.email, avatarUrl: identity.picture },
    };
  }
}
