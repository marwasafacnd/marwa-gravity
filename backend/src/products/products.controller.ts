import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ): Promise<Product[]> {
    return this.productsService.findAll(search, category);
  }

  @Get('categories')
  async getCategories(): Promise<string[]> {
    return this.productsService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body('delta') delta: number,
  ): Promise<Product> {
    return this.productsService.updateStock(id, delta);
  }
}
