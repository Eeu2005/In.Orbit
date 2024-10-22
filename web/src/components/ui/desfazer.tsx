import { useQueryClient } from "@tanstack/react-query"
import { deletePendingGoals } from "../../http/delete-goalCompletion"
interface CompletionGoal {
  goalId: string
  createdAt: string
}
export function Desfazer({createdAt, goalId}:CompletionGoal) {
   const queryClient = useQueryClient() 
  async function handleDeleteCompletion() {
    await deletePendingGoals({ createdAt, goalId })
    queryClient.invalidateQueries({ queryKey: ['summary'] })
    queryClient.invalidateQueries({ queryKey: ['PendingGoals'] })
  }
  return (
    <span className="text-zinc-500 text-sm underline cursor-pointer" onClick={()=>{
      handleDeleteCompletion()
    }}>
      desfazer
    </span>
  )
}