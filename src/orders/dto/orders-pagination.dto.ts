import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';
import { PaginationDto } from 'src/common/dto';
import { OrderStatus } from '@prisma/client';

export class OrdersPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `Order status must be one of ${OrderStatusList}`,
  })
  status: OrderStatus;
}
