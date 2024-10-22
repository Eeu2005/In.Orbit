import dayjs from 'dayjs'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
export async function getWeekPendingGools() {
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayOfWeek = dayjs().startOf('week').toDate()
const lastDayCompletead = db.$with('last_day_Completead').as(
  db
    .select({
      completedAt: goalsCompletions.createdAt,
    })
    .from(goalsCompletions)
    .orderBy(desc(goalsCompletions.createdAt))
    .limit(1)
)
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )
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
          gte(goalsCompletions.createdAt, firstDayOfWeek)
        )
      )
      .groupBy(goalsCompletions.goalId)
  )

  const res = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts,lastDayCompletead)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      CompletionCounts:
        sql`COALESCE(${goalCompletionCounts.completionCount},0)`.mapWith(
          Number
        ),
      lastDayCompletead: lastDayCompletead.completedAt,
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    )
    .leftJoin(
      lastDayCompletead,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    )
  return {
    res,
  }
}
