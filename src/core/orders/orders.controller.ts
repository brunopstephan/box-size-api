import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { GetBoxesDto } from './dtos/orders.dto'
import { ApiKeyGuard } from 'src/guards'
import { ApiHeaders } from '@nestjs/swagger'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(ApiKeyGuard)
  @ApiHeaders([
    {
      name: 'x-api-key',
      description: 'API Key',
      required: true,
    },
  ])
  @Post('boxes')
  getBoxes(@Body() body: GetBoxesDto) {
    return this.ordersService.getBoxes(body)
  }
}
