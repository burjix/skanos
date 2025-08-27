import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/interfaces';
import type { CreateEventRequest } from '@skanos/shared';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new event' })
  async createEvent(@Request() req: AuthenticatedRequest, @Body() eventData: CreateEventRequest) {
    return this.eventsService.createEvent(req.user.id, eventData);
  }

  @Get()
  @ApiOperation({ summary: 'Get user events' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getEvents(
    @Request() req: AuthenticatedRequest,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    return this.eventsService.getEvents(req.user.id, {
      type,
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
    });
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s events' })
  async getTodayEvents(@Request() req: AuthenticatedRequest) {
    return this.eventsService.getTodayEvents(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single event' })
  async getEvent(@Request() req: AuthenticatedRequest, @Param('id') eventId: string) {
    return this.eventsService.getEvent(req.user.id, eventId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  async updateEvent(
    @Request() req: AuthenticatedRequest,
    @Param('id') eventId: string,
    @Body() updates: Partial<CreateEventRequest>,
  ) {
    return this.eventsService.updateEvent(req.user.id, eventId, updates);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  async deleteEvent(@Request() req: AuthenticatedRequest, @Param('id') eventId: string) {
    return this.eventsService.deleteEvent(req.user.id, eventId);
  }
}