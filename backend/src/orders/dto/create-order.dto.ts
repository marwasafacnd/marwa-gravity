import { IsArray, IsNumber, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  subtotal: number;
}

export class CreateOrderDto {
  @IsNumber()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  totalAmount: number;

  @IsString()
  paymentMethod: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
