import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  get project(): PrismaClient['project'] {
    return this.client.project;
  }

  get skill(): PrismaClient['skill'] {
    return this.client.skill;
  }

  get user(): PrismaClient['user'] {
    return this.client.user;
  }

  get document(): PrismaClient['document'] {
    return this.client.document;
  }

  get refreshToken(): PrismaClient['refreshToken'] {
    return this.client.refreshToken;
  }

  get $queryRaw() {
    return this.client.$queryRaw.bind(this.client);
  }

  get $executeRaw() {
    return this.client.$executeRaw.bind(this.client);
  }

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
