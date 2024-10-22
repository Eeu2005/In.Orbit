import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoalComplete } from '../functions/create-goal-complete'
export const goalCompletionRoute: FastifyPluginAsyncZod = async  app => {
 app.post(
  '/completions',
  {
    schema: {
      body: z.object({
        id: z.string(),
      }),
    },
  },
  async req => await createGoalComplete(req.body)
  
)
}