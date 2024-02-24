import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from '../../schemas/area.schema';
import { Region, RegionSchema } from '../../schemas/region.schema';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { CacheService } from '../../services/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: Region.name, schema: RegionSchema },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService, ErrorHandlerService, MyJwtService, CacheService],
})
export class LocationModule {}
