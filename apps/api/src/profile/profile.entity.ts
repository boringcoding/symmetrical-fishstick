import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  // External auth linkage (Telegram) — enables cross-device recovery.
  @Column({ type: 'varchar', length: 64, nullable: true, unique: true })
  authSub: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  authProvider: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 400, nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'date', nullable: true })
  birthDate: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  city: string | null;

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  // Minutes east of UTC for the user's location (e.g. Phnom Penh = +420).
  @Column({ type: 'int', default: 0 })
  tzOffsetMin: number;

  @Column({ type: 'varchar', length: 8, default: 'en' })
  language: string;

  @Column({ type: 'simple-array', nullable: true })
  categories: string[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
