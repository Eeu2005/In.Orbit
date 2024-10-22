import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import dayjs from 'dayjs'
const lastDayOfWeek = dayjs().endOf('week').toDate()
const firstDayOfWeek = dayjs().startOf('week').toDate()
const today = dayjs()
interface createGoalCompleteRequest {
  id: string
}
export async function createGoalComplete({ id }: createGoalCompleteRequest) {
  const goalCompletionCounts = db.$with('goal_completion_count').as(
    db
      .select({
        goalId: goalsCompletions.goalId,
        completionCount: count(goalsCompletions.id).as('completion_count'),
      })
      .from(goalsCompletions)
      .where(
        and(
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          eq(goalsCompletions.goalId, id)
        )
      )
      .groupBy(goalsCompletions.goalId)
  )

  const result = await db
    .with(goalCompletionCounts)
    .select({
      createdAt: goalsCompletions.createdAt,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      CompletionCounts:sql`COALESCE(${goalCompletionCounts.completionCount},0)`.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .leftJoin(goalsCompletions,eq(goalsCompletions.goalId,goals.id))
    .where(eq(goals.id, id))
    .orderBy(desc(goalsCompletions.createdAt))
    const {CompletionCounts,desiredWeeklyFrequency,createdAt } = result[0]
     if (CompletionCounts >= desiredWeeklyFrequency) {
      throw new Error('goal already completed this week')
    }
    if(today.diff(createdAt,"h")<=12){
       throw new Error(`Goal already completed Today\n ${createdAt}`)
    }
    
     
      const insertResut = await db.insert(goalsCompletions).values({
        goalId:id,
        createdAt:today.toDate()
      }).returning()
      return{
        insertResut
        }
  }
