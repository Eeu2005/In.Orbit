type PendingGoalsResponse = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  CompletionCounts: number
  lastDayCompletead: Date | null
}[]

export async function getPendingGoals(): Promise<PendingGoalsResponse> {
  
  const data = await (await fetch('http://localhost:1900/pending-goals')).json()
  console.log(data)
  return data
}