import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrdersPaginationDto } from './dto/orders-pagination.dto';
import { ChangeOrderStatus } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createOrderDto: CreateOrderDto) {
    return {
      service: 'Orders Microservice',
      createOrderDto,
    };
  }

  async findAll(ordersPaginationDto: OrdersPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: ordersPaginationDto.status,
      },
    });

    const currentPage = ordersPaginationDto.page || 1;
    const perPage = ordersPaginationDto.limit || 10;

    return {
      data: await this.order.findMany({
        where: {
          status: ordersPaginationDto.status,
        },
        skip: (currentPage - 1) * perPage,
        take: perPage,
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({ where: { id } });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        msg: `Order with id ${id} not found`,
      });
    }

    return order;
  }

  async changeOrderStatus(changeOrderStatus: ChangeOrderStatus) {
    const { id, status } = changeOrderStatus;

    const order = await this.findOne(id);

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        msg: `Order with id ${id} not found`,
      });
    }

    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
