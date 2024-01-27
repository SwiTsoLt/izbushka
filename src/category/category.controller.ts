import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../schemas/category.schema';
import { Types } from 'mongoose';
import { PostCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';

// TODO: Добавить оставшиеся категории начиная с Стройматериалы

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Get

  @Get()
  public async getAll(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Get('/:id')
  public async getById(@Param('id') id: Types.ObjectId): Promise<Category> {
    return this.categoryService.getById(id);
  }

  // Post

  @Post()
  public async post(
    @Body() postCategoryDTO: PostCategoryDTO,
  ): Promise<Category> {
    return this.categoryService.post(postCategoryDTO);
  }

  // Update

  @Put('/:id')
  public async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDTO);
  }

  // Delete

  @Delete('/:id')
  public async delete(@Param('id') id: Types.ObjectId): Promise<Category> {
    return this.categoryService.delete(id);
  }
}
