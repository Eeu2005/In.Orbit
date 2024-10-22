import { db } from "../db"
import { goals } from "../db/schema"

interface createGoalRequest {
  title:string
  desiredWeeklyFrequency:number
}
export async function createGoal({title,desiredWeeklyFrequency}:createGoalRequest){
const result =( await db.insert(goals).values({
  title,
  desiredWeeklyFrequency
}).returning())[0]
return {result}
} 