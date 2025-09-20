import { OrdersService } from '../orders.service'
import { BOXES } from 'src/constants'
import { GetBoxesDto } from '../dtos/orders.dto'
import { Test } from '@nestjs/testing'

describe('OrdersService', () => {
  let service: OrdersService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile()

    service = moduleRef.get(OrdersService)
  })

  it('deve colocar um produto que cabe em uma caixa disponível', () => {
    const body: GetBoxesDto = {
      pedidos: [
        {
          pedido_id: 1,
          produtos: [
            {
              produto_id: 'PS5',
              dimensoes: { altura: 40, largura: 10, comprimento: 25 },
            },
          ],
        },
      ],
    }

    const result = service.getBoxes(body)

    expect(result.pedidos[0].caixas).toHaveLength(1)
    expect(result.pedidos[0].caixas[0].caixa_id).toBe(BOXES[0].id)
    expect(result.pedidos[0].caixas[0].produtos).toContain('PS5')
  })

  it('deve marcar produto como não cabendo em nenhuma caixa', () => {
    const body: GetBoxesDto = {
      pedidos: [
        {
          pedido_id: 2,
          produtos: [
            {
              produto_id: 'Gigante',
              dimensoes: { altura: 999, largura: 999, comprimento: 999 },
            },
          ],
        },
      ],
    }

    const result = service.getBoxes(body)

    expect(result.pedidos[0].caixas[0].caixa_id).toBeNull()
    expect(result.pedidos[0].caixas[0].observacao).toBe(
      'Produto não cabe em nenhuma caixa disponível.',
    )
  })

  it('deve colocar dois produtos que cabem juntos na mesma caixa', () => {
    const body: GetBoxesDto = {
      pedidos: [
        {
          pedido_id: 3,
          produtos: [
            {
              produto_id: 'PS5',
              dimensoes: { altura: 40, largura: 10, comprimento: 25 },
            },
            {
              produto_id: 'Volante',
              dimensoes: { altura: 40, largura: 30, comprimento: 30 },
            },
          ],
        },
      ],
    }

    const result = service.getBoxes(body)
    const caixas = result.pedidos[0].caixas

    expect(caixas).toHaveLength(1)
    expect(caixas[0].produtos).toEqual(
      expect.arrayContaining(['PS5', 'Volante']),
    )
  })
})
