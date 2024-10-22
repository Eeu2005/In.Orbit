import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteGoalComplete } from '../functions/delete-goal-completion'

export const deleteGoalCompleteRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/delete-completead',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
          createdAt: z.coerce.date(),
        }),
      },
    },
    
    async req =>{ 
      const {goalId, createdAt} = req.body
      return deleteGoalComplete({
        goalId,
        createdAt:createdAt 
      })
    }
  )
}