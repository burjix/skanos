import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateEntityRequest } from '@skanos/shared';

@Injectable()
export class EntitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntity(userId: string, entityData: CreateEntityRequest) {
    return this.prisma.entity.create({
      data: {
        ...entityData,
        userId,
      },
    });
  }

  async getEntities(userId: string, type?: string) {
    return this.prisma.entity.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            entityEvents: true,
            memories: true,
          },
        },
      },
    });
  }

  async getEntity(userId: string, entityId: string) {
    return this.prisma.entity.findFirst({
      where: {
        id: entityId,
        userId,
      },
      include: {
        entityEvents: {
          include: {
            event: true,
          },
        },
        memories: true,
        relationships: {
          include: {
            to: true,
          },
        },
        relatedTo: {
          include: {
            from: true,
          },
        },
      },
    });
  }
}