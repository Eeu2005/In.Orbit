import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoalRoute } from '../routes/create-goals'
import { goalCompletionRoute } from '../routes/create-completions'
import { pendingGoalsRoute } from '../routes/pending-goals'
import { WeekSummaryRoute } from '../routes/get-week-summary'
import fastifyCors from '@fastify/cors'
import { deleteGoalCompleteRoute } from '../routes/delete-completion'
 const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyCors,{
  origin:"*"
})
app.get('/', () => {
  return { messange: 'hello world' }
})

app.register(createGoalRoute)
app.register(goalCompletionRoute)
app.register(pendingGoalsRoute)
app.register(WeekSummaryRoute)
app.register(deleteGoalCompleteRoute)

app
  .listen({
    port: 1900,
  })
  .then(() => {
    console.log('Servidor HTTP rodando \nhttp://localhost:1900')
  })
