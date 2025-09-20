import { Injectable } from '@nestjs/common'
import { GetBoxesDto, GetBoxesResponse } from './dtos/orders.dto'
import { BOXES } from 'src/constants'

type Box = (typeof BOXES)[number]

function getProductVolume({
  altura,
  largura,
  comprimento,
}: GetBoxesDto['pedidos'][number]['produtos'][number]['dimensoes']) {
  return altura * largura * comprimento
}

function getBoxVolume(box: Box) {
  return box.width * box.height * box.length
}

function fits(
  product: { altura: number; largura: number; comprimento: number },
  box: Box,
): boolean {
  /* if (!box) return false

  return (
    product.altura <= box.height &&
    product.largura <= box.width &&
    product.comprimento <= box.length
  ) */

  // O método abaixo foi uma solução que achei fazendo pesquisas de como
  // verificar se um objeto 3D cabe dentro de outro

  const rotations: [number, number, number][] = [
    [product.altura, product.largura, product.comprimento],
    [product.altura, product.comprimento, product.largura],
    [product.largura, product.altura, product.comprimento],
    [product.largura, product.comprimento, product.altura],
    [product.comprimento, product.altura, product.largura],
    [product.comprimento, product.largura, product.altura],
  ]

  return rotations.some(
    ([h, w, l]) => h <= box.height && w <= box.width && l <= box.length,
  )
}

@Injectable()
export class OrdersService {
  getBoxes(body: GetBoxesDto): GetBoxesResponse {
    return {
      pedidos: body.pedidos.map((order) => {
        const boxes: GetBoxesResponse['pedidos'][number]['caixas'] = []

        const sortedProducts = [...order.produtos].sort((a, b) => {
          return getProductVolume(b.dimensoes) - getProductVolume(a.dimensoes)
        })

        for (const product of sortedProducts) {
          const productVolume = getProductVolume(product.dimensoes)
          let placed = false

          for (const boxInfo of boxes) {
            const box = BOXES.find((b) => b.id === boxInfo.caixa_id)!
            const usedVolume = boxInfo.produtos
              .map((id) => {
                const p = order.produtos.find((pp) => pp.produto_id === id)!
                return getProductVolume(p.dimensoes)
              })
              .reduce((acc, v) => acc + v, 0)

            if (
              fits(product.dimensoes, box) &&
              usedVolume + productVolume <= getBoxVolume(box)
            ) {
              boxInfo.produtos.push(product.produto_id)
              placed = true
              break
            }
          }

          if (!placed) {
            const box = BOXES.find(
              (b) =>
                fits(product.dimensoes, b) && getBoxVolume(b) >= productVolume,
            )
            if (!box) {
              boxes.push({
                caixa_id: null,
                produtos: [product.produto_id],
                observacao: 'Produto não cabe em nenhuma caixa disponível.',
              })
            } else {
              boxes.push({
                caixa_id: box.id,
                produtos: [product.produto_id],
              })
            }
          }
        }

        return { pedido_id: order.pedido_id, caixas: boxes }
      }),
    }
  }
}
