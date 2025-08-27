import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MemoriesService } from './memories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';
import type { CreateMemoryRequest } from '@skanos/shared';

@ApiTags('memories')
@Controller('memories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new memory' })
  async createMemory(@Request() req: AuthenticatedRequest, @Body() memoryData: CreateMemoryRequest) {
    return this.memoriesService.createMemory(req.user.id, memoryData);
  }

  @Get()
  @ApiOperation({ summary: 'Get user memories' })
  @ApiQuery({ name: 'type', required: false })
  async getMemories(@Request() req: AuthenticatedRequest, @Query('type') type?: string) {
    return this.memoriesService.getMemories(req.user.id, type);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search memories' })
  @ApiQuery({ name: 'q', required: true })
  async searchMemories(@Request() req: AuthenticatedRequest, @Query('q') query: string) {
    return this.memoriesService.searchMemories(req.user.id, query);
  }
}