import { client, db } from "."
import { goals, goalsCompletions } from "./schema"
import dayjs from "dayjs"
async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)
  const result = await db
    .insert(goals)
    .values([
      {
        title: "Fazer academia",
        desiredWeeklyFrequency:4,
      },
      {
        title: "meditar",
        desiredWeeklyFrequency:7,
      },
      {
        title: "Estudar",
        desiredWeeklyFrequency: 3,
      },
    ])
    .returning()
  const startOfWeek  = dayjs().startOf("week")
  await db.insert(goalsCompletions).values([
    {goalId:result[0].id,createdAt:startOfWeek.toDate()},
    {goalId:result[1].id,createdAt:startOfWeek.add(1,"day").toDate()},
  ])
}
seed().finally(()=>{
  client.end()
})