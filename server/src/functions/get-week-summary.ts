import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import dayjs from 'dayjs'
type GoalsPerDay = Record<
  string,
  {
    id: string
    title: string
    completedAt: string
  }[]
>
const lastDayOfWeek = dayjs().endOf('week').toDate()
const firstDayOfWeek = dayjs().startOf('week').toDate()
export async function getWeekSummary() {
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalCompletedInWeek = db.$with('goal_completed_in_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        completedAt: goalsCompletions.createdAt,
        complatedAtDate: sql`DATE(${goalsCompletions.createdAt})`.as(
          'completedAtDate'
        ),
      })
      .from(goalsCompletions)
      .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
      .where(
        and(
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          gte(goalsCompletions.createdAt, firstDayOfWeek)
        )
      )
      .orderBy(desc(goalsCompletions.createdAt))
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAtDate: goalCompletedInWeek.complatedAtDate,
        completions: sql`
        JSON_AGG(
        JSON_BUILD_OBJECT(
        'id',${goalCompletedInWeek.id},
        'title',${goalCompletedInWeek.title},
        'completedAt',${goalCompletedInWeek.completedAt}
        )
        )
        `.as('completions'),
      })
      .from(goalCompletedInWeek)
      .groupBy(goalCompletedInWeek.complatedAtDate)
      .orderBy(desc(goalCompletedInWeek.complatedAtDate))
  )
  const result = await db
    .with(goalsCreatedUpToWeek, goalCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql`(select Count(*) from ${goalCompletedInWeek})`.mapWith(
        Number
      ),
      total:
        sql`(select sum(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) from ${goalsCreatedUpToWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql<GoalsPerDay>`
      JSON_OBJECT_AGG(
      ${goalsCompletedByWeekDay.completedAtDate},${goalsCompletedByWeekDay.completions}
      )
      `,
    })
    .from(goalsCompletedByWeekDay)
  return {
    summary: result[0],
  }
}
