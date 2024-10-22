import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummary } from '../functions/get-week-summary'
export const WeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/week-summary', async () => {
    const summry  = (await getWeekSummary())
    return summry
  })
}
