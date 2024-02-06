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
import { Area } from '../../schemas/area.schema';
import { Region } from '../../schemas/region.schema';
import { Types } from 'mongoose';
import {
  PostAreaDTO,
  PostRegionDTO,
  UpdateAreaDTO,
  UpdateRegionDTO,
} from '../../dtos/location.dto';
import { Auth } from '../../decorators/auth/auth.decorator';
import { rolesEnum } from '../../interfaces/roles/roles.interface';

/*
    Area - Город
    Region - Район
*/

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
  @Auth(rolesEnum.admin)
  public async postArea(@Body() postAreaDTO: PostAreaDTO): Promise<Area> {
    return this.locationService.postArea(postAreaDTO);
  }

  // Area Patch
  @Patch('/area/:id')
  @Auth(rolesEnum.admin)
  public async updateArea(
    @Param('id') id: Types.ObjectId,
    @Body() updateAreaDTO: UpdateAreaDTO,
  ): Promise<Area> {
    return this.locationService.updateArea(id, updateAreaDTO);
  }

  // Area Delete
  @Delete('/area/:id')
  @Auth(rolesEnum.admin)
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
  @Auth(rolesEnum.admin)
  public async postRegion(
    @Body() postRegionDTO: PostRegionDTO,
  ): Promise<Region> {
    return this.locationService.postRegion(postRegionDTO);
  }

  // Region Patch
  @Patch('/region/:id')
  @Auth(rolesEnum.admin)
  public async updateRegion(
    @Param('id') id: Types.ObjectId,
    @Body() updateRegionDTO: UpdateRegionDTO,
  ): Promise<Region> {
    return this.locationService.updateRegion(id, updateRegionDTO);
  }

  // Region Delete
  @Delete('/region/:id')
  @Auth(rolesEnum.admin)
  public async deleteRegion(@Param('id') id: Types.ObjectId): Promise<Region> {
    return this.locationService.deleteRegion(id);
  }
}
