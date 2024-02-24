import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../../schemas/category.schema';
import { Model, Types } from 'mongoose';
import {
  type PostCategoryDTO,
  type UpdateCategoryDTO,
} from '../../dtos/category.dto';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { CacheService } from '../../services/cache/cache.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly cacheService: CacheService,
  ) {}

  // Get
  public async getAll(): Promise<Category[]> {
    return this.errorHandlerService.handleError<Category[]>(
      this.categoryModel.find().exec(),
    );
  }

  public async getById(id: Types.ObjectId): Promise<Category> {
    return await this.errorHandlerService.handleError<Category>(
      this.categoryModel.findById(id).exec(),
    );
  }

  // Post

  public async post(postCategoryDTO: PostCategoryDTO): Promise<Category> {
    await this.cacheService.deleteCategories();

    const newCategory = await this.errorHandlerService.handleError(
      new this.categoryModel({
        ...postCategoryDTO,
        children: [],
        parent: postCategoryDTO.parent && postCategoryDTO.parent,
      }).save(),
    );

    if (postCategoryDTO.parent) {
      await this.errorHandlerService.handleError<Category>(
        this.categoryModel.findByIdAndUpdate(postCategoryDTO.parent, {
          $push: { children: newCategory._id },
        }),
      );
    }

    return newCategory;
  }

  // Patch

  public async update(
    id: Types.ObjectId,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    await this.cacheService.deleteCategoryById(id);

    return await this.errorHandlerService.handleError<Category>(
      this.categoryModel.findByIdAndUpdate(id, updateCategoryDTO).exec(),
    );
  }

  // Delete

  public async delete(id: Types.ObjectId): Promise<Category> {
    await this.cacheService.deleteCategoryById(id);

    const deletedCategory =
      await this.errorHandlerService.handleError<Category>(
        this.categoryModel.findByIdAndDelete(id),
      );

    deletedCategory.children.forEach(async (childId: Types.ObjectId) => {
      await this.errorHandlerService.handleError<Category>(
        this.categoryModel.findByIdAndDelete(childId).exec(),
      );
    });

    return deletedCategory;
  }
}
