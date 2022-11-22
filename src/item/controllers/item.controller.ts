import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ItemCategoryOutputDTO,
  ItemCategoryWithMenusOutputDTO,
} from '../dtos/item-category-output.dto';
import { ItemOutputDTO } from '../dtos/item-output.dto';
import { ItemService } from '../services/item.service';

@ApiTags('item')
@Controller('item')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class ItemController {
  constructor(private readonly service: ItemService) {}

  // get all category
  @Get('category')
  @ApiOperation({
    summary: 'get all categories',
  })
  async getAllCategories(): Promise<ItemCategoryOutputDTO[]> {
    return await this.service.getAllCategory();
  }

  // get all menu by category
  @Get('menu/category/all')
  @ApiOperation({
    summary: 'get all meny by category',
  })
  async getAllCategoryWithItsMenu(): Promise<ItemCategoryWithMenusOutputDTO[]> {
    return await this.service.getAllCategoryWithItsMenu();
  }

  // get all menu by category
  @Get('menu/category/:id')
  @ApiOperation({
    summary: 'get all meny by category',
  })
  async getAllMenuByCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<ItemOutputDTO[]> {
    return await this.service.getAllMenuByCategory(categoryId);
  }
}
