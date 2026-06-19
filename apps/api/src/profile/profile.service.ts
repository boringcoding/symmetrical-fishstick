import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  async create(dto: CreateProfileDto): Promise<Profile> {
    const profile = this.repo.create({
      name: dto.name,
      birthDate: dto.birthDate ?? null,
      city: dto.city ?? null,
      latitude: dto.latitude ?? null,
      longitude: dto.longitude ?? null,
      tzOffsetMin: dto.tzOffsetMin ?? 0,
      language: dto.language ?? 'en',
      categories: dto.categories ?? null,
    });
    return this.repo.save(profile);
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.repo.findOne({ where: { id } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async findByAuthSub(sub: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { authSub: sub } });
  }

  async linkAuth(
    id: string,
    payload: {
      sub: string;
      provider: string;
      username?: string | null;
      avatarUrl?: string | null;
    },
  ): Promise<Profile> {
    const profile = await this.findOne(id);
    profile.authSub = payload.sub;
    profile.authProvider = payload.provider;
    if (payload.username) profile.username = payload.username;
    if (payload.avatarUrl) profile.avatarUrl = payload.avatarUrl;
    return this.repo.save(profile);
  }

  async update(id: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);
    Object.assign(profile, {
      name: dto.name ?? profile.name,
      birthDate: dto.birthDate ?? profile.birthDate,
      city: dto.city ?? profile.city,
      latitude: dto.latitude ?? profile.latitude,
      longitude: dto.longitude ?? profile.longitude,
      tzOffsetMin: dto.tzOffsetMin ?? profile.tzOffsetMin,
      language: dto.language ?? profile.language,
      categories: dto.categories ?? profile.categories,
    });
    return this.repo.save(profile);
  }
}
