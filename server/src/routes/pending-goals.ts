
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGools } from '../functions/get-week-pending-gools'
export const pendingGoalsRoute: FastifyPluginAsyncZod = async  app => {
 app.get('/pending-goals', async () => {
  const { res } = await getWeekPendingGools()
  return res
})
}
