import { IsString, IsNotEmpty, IsNumber, IsOptional, IsMin, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
