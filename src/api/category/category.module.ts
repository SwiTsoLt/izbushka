import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../schemas/category.schema';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { MyJwtService } from '../../services/jwt/jwt.service';
import { CacheService } from '../../services/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, ErrorHandlerService, MyJwtService, CacheService],
})
export class CategoryModule {}
