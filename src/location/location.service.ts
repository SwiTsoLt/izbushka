import { Injectable } from '@nestjs/common';
import { Area } from '../schemas/area.schema';
import { Region } from '../schemas/region.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PostAreaDTO,
  PostRegionDTO,
  UpdateAreaDTO,
  UpdateRegionDTO,
} from '../dtos/location.dto';
import { ErrorHandlerService } from '../services/error-handler/error-handler.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    @InjectModel(Region.name) private readonly regionModel: Model<Region>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  // Area

  // Area Get

  public async getAreaAll(): Promise<Area[]> {
    return this.errorHandlerService.handleError<Area[]>(
      this.areaModel.find().exec(),
    );
  }

  public async getAreaById(id: Types.ObjectId): Promise<Area> {
    return this.errorHandlerService.handleError<Area>(
      this.areaModel.findById(id).exec(),
    );
  }

  // Area Post

  public async postArea(postAreaDTO: PostAreaDTO): Promise<Area> {
    return this.errorHandlerService.handleError<Area>(
      new this.areaModel(postAreaDTO).save(),
    );
  }

  // Area Update

  public async updateArea(
    id: Types.ObjectId,
    updateAreaDTO: UpdateAreaDTO,
  ): Promise<Area> {
    return this.errorHandlerService.handleError<Area>(
      this.areaModel.findByIdAndUpdate(id, updateAreaDTO).exec(),
    );
  }

  // Area Delete

  public async deleteArea(id: Types.ObjectId): Promise<Area> {
    return this.errorHandlerService.handleError<Area>(
      this.areaModel.findById(id).exec(),
    );
  }

  // Region

  // Region Get

  public async getRegionAll(): Promise<Region[]> {
    return this.errorHandlerService.handleError<Region[]>(
      this.regionModel.find().exec(),
    );
  }

  public async getRegionById(id: Types.ObjectId): Promise<Region> {
    return this.errorHandlerService.handleError<Region>(
      this.regionModel.findById(id).exec(),
    );
  }

  // Region Post

  public async postRegion(postRegionDTO: PostRegionDTO): Promise<Region> {
    return new this.regionModel(postRegionDTO).save();
  }

  // Region Update

  public async updateRegion(
    id: Types.ObjectId,
    updateRegionDTO: UpdateRegionDTO,
  ): Promise<Region> {
    return this.errorHandlerService.handleError<Region>(
      this.regionModel.findByIdAndUpdate(id, updateRegionDTO).exec(),
    );
  }

  // Region Delete

  public async deleteRegion(id: Types.ObjectId): Promise<Region> {
    return this.errorHandlerService.handleError<Region>(
      this.regionModel.findByIdAndDelete(id).exec(),
    );
  }
}
