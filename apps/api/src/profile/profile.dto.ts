import {
  IsArray,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(1, 120)
  name: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'birthDate must be YYYY-MM-DD' })
  birthDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  city?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @Min(-840)
  @Max(840)
  tzOffsetMin?: number;

  @IsOptional()
  @IsIn(['en', 'km'])
  language?: string;

  @IsOptional()
  @IsArray()
  categories?: string[];
}

export class UpdateProfileDto extends CreateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name: string;
}
