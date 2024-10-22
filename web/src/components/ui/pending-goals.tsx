import { Plus } from "lucide-react";
import { OutlineButton } from "./outline-button";
import { getPendingGoals } from "../../http/get-pending-goals";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createGoalCompletion } from "../../http/creation-goal-completion";
import dayjs from "dayjs";

export function PendingGoals(){
    const { data } = useQuery({
      queryKey: ['PendingGoals'],
      queryFn: getPendingGoals,
      staleTime: 1000 * 60,
    })
    if(!data){
      return null
    }
    const queryClient = useQueryClient() 
   async function handleCompletionGoal (goalId:string){
      await createGoalCompletion(goalId)
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['PendingGoals'] })
    }
  return (
    <div className="flex flex-wrap gap-3">
      {data.map((e)=>{
        const today = dayjs()
          const CompleteadToday = today.diff(e.lastDayCompletead,"hour")<=12
        return (
          <OutlineButton key={e.id} disabled={e.CompletionCounts>=e.desiredWeeklyFrequency ||CompleteadToday } onClick={()=> {
            handleCompletionGoal(e.id)
            }} >
            <Plus />
            {e.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}