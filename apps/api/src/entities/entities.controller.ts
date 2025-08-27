import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';
import type { CreateEntityRequest } from '@skanos/shared';

@ApiTags('entities')
@Controller('entities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new entity' })
  async createEntity(@Request() req: AuthenticatedRequest, @Body() entityData: CreateEntityRequest) {
    return this.entitiesService.createEntity(req.user.id, entityData);
  }

  @Get()
  @ApiOperation({ summary: 'Get user entities' })
  @ApiQuery({ name: 'type', required: false })
  async getEntities(@Request() req: AuthenticatedRequest, @Query('type') type?: string) {
    return this.entitiesService.getEntities(req.user.id, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single entity' })
  async getEntity(@Request() req: AuthenticatedRequest, @Param('id') entityId: string) {
    return this.entitiesService.getEntity(req.user.id, entityId);
  }
}