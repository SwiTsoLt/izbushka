import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas/category.schema';
import { Model, Types } from 'mongoose';
import { PostCategoryDTO, UpdateCategoryDTO } from 'src/dtos/category.dto';
import { ErrorHandlerService } from 'src/services/error-handler/error-handler.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  // Get

  public async getAll(): Promise<Category[]> {
    return this.errorHandlerService.handleError<Category[]>(
      this.categoryModel.find().exec(),
    );
  }

  public async getById(id: Types.ObjectId): Promise<Category> {
    return this.errorHandlerService.handleError<Category>(
      this.categoryModel.findById(id).exec(),
    );
  }

  // Post

  public async post(postCategoryDTO: PostCategoryDTO): Promise<Category> {
    const newCategory = await this.errorHandlerService.handleError(
      new this.categoryModel({
        ...postCategoryDTO,
        children: [],
        parent:
          postCategoryDTO.parent && new Types.ObjectId(postCategoryDTO.parent),
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

  // Update

  public async update(
    id: Types.ObjectId,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    return this.errorHandlerService.handleError<Category>(
      this.categoryModel.findByIdAndUpdate(id, updateCategoryDTO).exec(),
    );
  }

  // Delete

  public async delete(id: Types.ObjectId): Promise<Category> {
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
