import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateMemoryRequest } from '@skanos/shared';

@Injectable()
export class MemoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMemory(userId: string, memoryData: CreateMemoryRequest) {
    return this.prisma.memory.create({
      data: {
        ...memoryData,
        userId,
      },
    });
  }

  async getMemories(userId: string, type?: string) {
    return this.prisma.memory.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: { importance: 'desc' },
      include: {
        entity: true,
      },
    });
  }

  async searchMemories(userId: string, query: string) {
    // Simple text search for now - would use vector similarity in production
    return this.prisma.memory.findMany({
      where: {
        userId,
        content: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: { importance: 'desc' },
      include: {
        entity: true,
      },
    });
  }
}