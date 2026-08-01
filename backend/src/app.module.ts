import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE', 'sqlite');

        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get<string>('DB_USER', 'pos_user'),
            password: configService.get<string>('DB_PASSWORD', 'pos_password'),
            database: configService.get<string>('DB_NAME', 'pos_db'),
            entities: [Product, Order, OrderItem],
            synchronize: true, // Auto schema migration for dev
          };
        }

        // Default SQLite embedded fallback for immediate zero-config execution
        return {
          type: 'sqlite',
          database: 'pos_database.sqlite',
          entities: [Product, Order, OrderItem],
          synchronize: true,
        };
      },
    }),
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
