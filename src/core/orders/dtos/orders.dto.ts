import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const getBoxesSchema = z.object({
  pedidos: z.array(
    z.object({
      pedido_id: z.number(),
      produtos: z.array(
        z.object({
          produto_id: z.string(),
          dimensoes: z.object({
            altura: z.number(),
            largura: z.number(),
            comprimento: z.number(),
          }),
        }),
      ),
    }),
  ),
})

export class GetBoxesDto extends createZodDto(getBoxesSchema) {}

export const getBoxesResponseSchema = z.object({
  pedidos: z.array(
    z.object({
      pedido_id: z.number(),
      caixas: z.array(
        z.object({
          caixa_id: z.string().or(z.null()),
          produtos: z.array(z.string()),
          observacao: z.string().optional(),
        }),
      ),
    }),
  ),
})

export type GetBoxesResponse = z.infer<typeof getBoxesResponseSchema>
