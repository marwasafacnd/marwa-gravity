import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

const INITIAL_POS_PRODUCTS = [
  {
    name: 'Artisan Espresso',
    sku: 'BEV-001',
    barcode: '8901001001',
    description: 'Double shot rich dark roast espresso.',
    price: 3.50,
    category: 'Beverages',
    stock: 48,
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Iced Vanilla Oat Latte',
    sku: 'BEV-002',
    barcode: '8901001002',
    description: 'Smooth cold espresso poured over oat milk and Madagascar vanilla.',
    price: 5.25,
    category: 'Beverages',
    stock: 32,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Matcha Green Tea Latte',
    sku: 'BEV-003',
    barcode: '8901001003',
    description: 'Ceremonial grade Uji matcha steamed with creamy milk.',
    price: 5.75,
    category: 'Beverages',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Freshly Baked Croissant',
    sku: 'BAK-001',
    barcode: '8902002001',
    description: 'Flaky french buttery croissant baked fresh every morning.',
    price: 3.25,
    category: 'Bakery',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Avocado Toast & Sourdough',
    sku: 'BAK-002',
    barcode: '8902002002',
    description: 'Toasted sourdough topped with crushed avocado and red pepper flakes.',
    price: 8.50,
    category: 'Bakery',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Chocolate Chip Cookie',
    sku: 'BAK-003',
    barcode: '8902002003',
    description: 'Soft-baked gourmet cookie with Belgian dark chocolate chips.',
    price: 2.75,
    category: 'Bakery',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Smoked Turkey & Swiss Sandwich',
    sku: 'SNK-001',
    barcode: '8903003001',
    description: 'Sliced turkey breast, aged swiss cheese, and honey mustard blend.',
    price: 9.75,
    category: 'Snacks',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Organic Honey Granola Bowl',
    sku: 'SNK-002',
    barcode: '8903003002',
    description: 'Greek yogurt topped with toasted oats, chia seeds, and berries.',
    price: 6.95,
    category: 'Snacks',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Fresh Crisp Fuji Apple',
    sku: 'PRD-001',
    barcode: '8904004001',
    description: 'Sweet and crispy farm-fresh organic Fuji apple.',
    price: 1.50,
    category: 'Produce',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Organic Whole Milk 1L',
    sku: 'DRY-001',
    barcode: '8905005001',
    description: 'Pasteurized 100% pure organic whole milk carton.',
    price: 4.10,
    category: 'Dairy',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
  },
];

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  async seedProducts() {
    const count = await this.productRepository.count();
    if (count === 0) {
      console.log('Seeding initial POS product catalog into database...');
      for (const item of INITIAL_POS_PRODUCTS) {
        const product = this.productRepository.create(item);
        await this.productRepository.save(product);
      }
      console.log('Successfully seeded POS product catalog!');
    }
  }

  async findAll(search?: string, category?: string): Promise<Product[]> {
    const where: FindOptionsWhere<Product>[] = [];

    if (search && category && category !== 'All') {
      const q = `%${search.toLowerCase()}%`;
      where.push(
        { category, name: Like(q) },
        { category, sku: Like(q) },
        { category, barcode: Like(q) }
      );
    } else if (search) {
      const q = `%${search.toLowerCase()}%`;
      where.push(
        { name: Like(q) },
        { sku: Like(q) },
        { barcode: Like(q) }
      );
    } else if (category && category !== 'All') {
      where.push({ category });
    }

    return this.productRepository.find({
      where: where.length > 0 ? where : {},
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async updateStock(id: string, delta: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock = Math.max(0, product.stock + delta);
    return this.productRepository.save(product);
  }

  async getCategories(): Promise<string[]> {
    const products = await this.productRepository.find({ select: ['category'] });
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return ['All', ...categories.sort()];
  }
}
