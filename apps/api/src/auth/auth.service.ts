import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

export interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface ExternalIdentity {
  sub: string; // e.g. "tg:123456"
  provider: 'telegram';
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
}

const MAX_AGE_SECONDS = 86400; // reject logins older than a day

@Injectable()
export class AuthService {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  private readonly botUsername = process.env.TELEGRAM_BOT_USERNAME || '';

  get enabled(): boolean {
    return !!this.botToken;
  }

  get publicBot(): string {
    return this.botUsername;
  }

  /**
   * Verifies the Telegram Login Widget payload per
   * https://core.telegram.org/widgets/login#checking-authorization
   */
  verifyTelegram(data: TelegramAuthData): ExternalIdentity {
    if (!this.enabled) {
      throw new UnauthorizedException('Telegram sign-in is not configured');
    }
    const { hash, ...rest } = data;
    const fields = rest as Record<string, unknown>;

    const checkString = Object.keys(fields)
      .filter((k) => fields[k] !== undefined && fields[k] !== null)
      .sort()
      .map((k) => `${k}=${fields[k]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(this.botToken).digest();
    const computed = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    if (computed !== hash) {
      throw new UnauthorizedException('Invalid Telegram signature');
    }
    const now = Math.floor(Date.now() / 1000);
    if (now - Number(data.auth_date) > MAX_AGE_SECONDS) {
      throw new UnauthorizedException('Telegram login expired');
    }

    const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;
    return {
      sub: `tg:${data.id}`,
      provider: 'telegram',
      name,
      username: data.username ?? null,
      avatarUrl: data.photo_url ?? null,
    };
  }
}
