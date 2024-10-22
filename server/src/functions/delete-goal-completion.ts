import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { goalsCompletions } from '../db/schema'
import dayjs from 'dayjs'
/* Eu sei que poderia ter utilizdo o id da tarefa concluida 
  Mas assim e mais legal
*/
interface deleteGoalCompleteRequest {
  goalId: string
  createdAt:Date 
}
export async function deleteGoalComplete({
  createdAt,
  goalId
}: deleteGoalCompleteRequest) {
  
let result: {
  id: string
  createdAt: Date
  goalId: string
}[] |string
   try{
    result = await db

      .delete(goalsCompletions)
      .where(
        and(
          eq(goalsCompletions.goalId,goalId),
          eq(goalsCompletions.createdAt,dayjs(createdAt).toDate())
        )
      ).returning()
    
    
  }catch(e){
      result = `Error ${e}`
    }
    return {result}
}
