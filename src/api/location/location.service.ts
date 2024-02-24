import { Injectable } from '@nestjs/common';
import { Area } from '../../schemas/area.schema';
import { Region } from '../../schemas/region.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  type PostAreaDTO,
  type PostRegionDTO,
  type UpdateAreaDTO,
  type UpdateRegionDTO,
} from '../../dtos/location.dto';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { CacheService } from '../../services/cache/cache.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    @InjectModel(Region.name) private readonly regionModel: Model<Region>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly cacheService: CacheService,
  ) {}

  // Area

  // Area Get

  public async getAreaAll(): Promise<Area[]> {
    return await this.errorHandlerService.handleError<Area[]>(
      this.areaModel.find().exec(),
    );
  }

  public async getAreaById(id: Types.ObjectId): Promise<Area> {
    return await this.errorHandlerService.handleError<Area>(
      this.areaModel.findById(id).exec(),
    );
  }

  // Area Post

  public async postArea(postAreaDTO: PostAreaDTO): Promise<Area> {
    await this.cacheService.deleteLocationAreas();
    return await this.errorHandlerService.handleError<Area>(
      new this.areaModel({ ...postAreaDTO, children: [] }).save(),
    );
  }

  // Area Patch

  public async updateArea(
    id: Types.ObjectId,
    updateAreaDTO: UpdateAreaDTO,
  ): Promise<Area> {
    await this.cacheService.deleteLocationAreaById(id);
    return await this.errorHandlerService.handleError<Area>(
      this.areaModel.findByIdAndUpdate(id, updateAreaDTO).exec(),
    );
  }

  // Area Delete

  public async deleteArea(id: Types.ObjectId): Promise<Area> {
    await this.cacheService.deleteLocationAreaById(id);

    const deletedArea = await this.errorHandlerService.handleError<Area>(
      this.areaModel.findByIdAndDelete(id).exec(),
    );

    deletedArea.children.forEach(async (childId: Types.ObjectId) => {
      await this.errorHandlerService.handleError<Area>(
        this.areaModel.findByIdAndDelete(childId).exec(),
      );
    });

    return deletedArea;
  }

  // Region

  // Region Get

  public async getRegionAll(): Promise<Region[]> {
    return await this.errorHandlerService.handleError<Region[]>(
      this.regionModel.find().exec(),
    );
  }

  public async getRegionById(id: Types.ObjectId): Promise<Region> {
    return await this.errorHandlerService.handleError<Region>(
      this.regionModel.findById(id).exec(),
    );
  }

  // Region Post

  public async postRegion(postRegionDTO: PostRegionDTO): Promise<Region> {
    await this.cacheService.deleteLocationRegions();

    const newRegion = await this.errorHandlerService.handleError(
      new this.regionModel(postRegionDTO).save(),
    );

    await this.errorHandlerService.handleError<Area>(
      this.areaModel.findByIdAndUpdate(postRegionDTO.parent, {
        $push: { children: newRegion._id },
      }),
    );

    return newRegion;
  }

  // Region Patch

  public async updateRegion(
    id: Types.ObjectId,
    updateRegionDTO: UpdateRegionDTO,
  ): Promise<Region> {
    await this.cacheService.deleteLocationRegionById(id);

    return await this.errorHandlerService.handleError<Region>(
      this.regionModel.findByIdAndUpdate(id, updateRegionDTO).exec(),
    );
  }

  // Region Delete

  public async deleteRegion(id: Types.ObjectId): Promise<Region> {
    await this.cacheService.deleteLocationRegionById(id);

    const deletedRegion = await this.errorHandlerService.handleError<Region>(
      this.regionModel.findByIdAndDelete(id).exec(),
    );

    await this.errorHandlerService.handleError<Area>(
      this.areaModel.findByIdAndUpdate(deletedRegion.parent, {
        $pull: { children: { $elemMatch: { _id: id } } },
      }),
    );

    return deletedRegion;
  }
}
