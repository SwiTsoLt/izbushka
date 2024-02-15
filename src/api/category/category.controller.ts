import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { type Category } from '../../schemas/category.schema';
import { Types } from 'mongoose';
import { PostCategoryDTO, UpdateCategoryDTO } from '../../dtos/category.dto';
import { rolesEnum } from '../../interfaces/roles.interface';
import { Roles } from '../../decorators/roles.decorator';

@Controller('api/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Get

  @Get()
  public async getAll(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }

  @Get('/:id')
  public async getById(@Param('id') id: Types.ObjectId): Promise<Category> {
    return await this.categoryService.getById(id);
  }

  // Post

  @Post()
  @Roles(rolesEnum.admin)
  public async post(
    @Body() postCategoryDTO: PostCategoryDTO,
  ): Promise<Category> {
    return await this.categoryService.post(postCategoryDTO);
  }

  // Patch

  @Patch('/:id')
  @Roles(rolesEnum.admin)
  public async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    return await this.categoryService.update(id, updateCategoryDTO);
  }

  // Delete

  @Delete('/:id')
  @Roles(rolesEnum.admin)
  public async delete(@Param('id') id: Types.ObjectId): Promise<Category> {
    return await this.categoryService.delete(id);
  }
}
