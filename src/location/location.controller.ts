import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { Area } from '../schemas/area.schema';
import { Region } from '../schemas/region.schema';
import { Types } from 'mongoose';
import {
  PostAreaDTO,
  PostRegionDTO,
  UpdateAreaDTO,
  UpdateRegionDTO,
} from 'src/dtos/location.dto';

/*
    Area - Город
    Region - Район
*/

// TODO: Добавить оставшиеся города и их районы

@Controller('api/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // Area

  // Area Get

  @Get('/area')
  public async getAreaAll(): Promise<Area[]> {
    return this.locationService.getAreaAll();
  }

  @Get('/area/:id')
  public async getAreaById(@Param('id') id: Types.ObjectId): Promise<Area> {
    return this.locationService.getAreaById(id);
  }

  // Area Post

  @Post('/area')
  public async postArea(@Body() postAreaDTO: PostAreaDTO): Promise<Area> {
    return this.locationService.postArea(postAreaDTO);
  }

  // Area Patch
  @Patch('/area/:id')
  public async updateArea(
    @Param('id') id: Types.ObjectId,
    @Body() updateAreaDTO: UpdateAreaDTO,
  ): Promise<Area> {
    return this.locationService.updateArea(id, updateAreaDTO);
  }

  // Area Delete
  @Delete('/area/:id')
  public async deleteArea(@Param('id') id: Types.ObjectId): Promise<Area> {
    return this.locationService.deleteArea(id);
  }

  // Region

  // Region Get

  @Get('/region')
  public async getRegionAll(): Promise<Region[]> {
    return this.locationService.getRegionAll();
  }

  @Get('/region/:id')
  public async getRegionById(@Param('id') id: Types.ObjectId): Promise<Region> {
    return this.locationService.getRegionById(id);
  }

  // Region Post

  @Post('/region')
  public async postRegion(
    @Body() postRegionDTO: PostRegionDTO,
  ): Promise<Region> {
    return this.locationService.postRegion(postRegionDTO);
  }

  // Region Patch
  @Patch('/region/:id')
  public async updateRegion(
    @Param('id') id: Types.ObjectId,
    @Body() updateRegionDTO: UpdateRegionDTO,
  ): Promise<Region> {
    return this.locationService.updateRegion(id, updateRegionDTO);
  }

  // Region Delete
  @Delete('/region/:id')
  public async deleteRegion(@Param('id') id: Types.ObjectId): Promise<Region> {
    return this.locationService.deleteRegion(id);
  }
}
