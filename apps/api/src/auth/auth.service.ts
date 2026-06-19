import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleIdentity {
  sub: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

@Injectable()
export class AuthService {
  private readonly clientId = process.env.GOOGLE_CLIENT_ID || '';
  private readonly client = new OAuth2Client(this.clientId);

  get enabled(): boolean {
    return !!this.clientId;
  }

  async verifyGoogle(idToken: string): Promise<GoogleIdentity> {
    if (!this.enabled) {
      throw new UnauthorizedException('Google sign-in is not configured');
    }
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });
      const p = ticket.getPayload();
      if (!p || !p.sub) throw new Error('No payload');
      return {
        sub: p.sub,
        email: p.email ?? null,
        name: p.name ?? null,
        picture: p.picture ?? null,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
