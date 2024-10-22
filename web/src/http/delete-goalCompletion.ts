interface CompletionGoal{
goalId:string,
createdAt:string
}
interface DeletePendingGoalsResponse {
  id: string
  createdAt: Date
  goalId: string
}[]

export async function deletePendingGoals({
  createdAt,goalId,
}: CompletionGoal): Promise<DeletePendingGoalsResponse> {
  console.log(`${createdAt}\n${goalId}`)
  const data = await (
    await fetch('http://localhost:1900/delete-completead', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        goalId,
        createdAt,
      }),
    })
  ).json()
  console.log(data)
  return data
}