import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderNumber = `POS-${Date.now().toString().slice(-6)}`;

    const order = this.orderRepository.create({
      orderNumber,
      subtotal: createOrderDto.subtotal,
      taxAmount: createOrderDto.taxAmount || 0,
      discountAmount: createOrderDto.discountAmount || 0,
      totalAmount: createOrderDto.totalAmount,
      paymentMethod: createOrderDto.paymentMethod || 'CASH',
      status: 'COMPLETED',
      items: createOrderDto.items.map((item) =>
        this.orderItemRepository.create({
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }),
      ),
    });

    const savedOrder = await this.orderRepository.save(order);

    // Deduct inventory stock for each sold item
    for (const item of createOrderDto.items) {
      try {
        await this.productsService.updateStock(item.productId, -item.quantity);
      } catch (err) {
        console.warn(`Could not update stock for product ${item.productId}`, err);
      }
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMetrics() {
    const orders = await this.findAll();
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toISOString().split('T')[0] === today,
    );

    const totalSalesToday = todayOrders.reduce(
      (acc, o) => acc + Number(o.totalAmount),
      0,
    );
    const totalOrdersCount = todayOrders.length;
    const totalItemsSoldToday = todayOrders.reduce(
      (acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );

    return {
      totalSalesToday,
      totalOrdersCount,
      totalItemsSoldToday,
      totalOrdersAllTime: orders.length,
    };
  }
}
