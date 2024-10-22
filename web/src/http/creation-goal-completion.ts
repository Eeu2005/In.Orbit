type createGoalCompletionResponse = {
  insertResult: {
    id: string
    title: string
    desiredWeeklyFrequency: number
    CompletionCounts: number
  }
}[]

export async function createGoalCompletion(
  id: string
): Promise<createGoalCompletionResponse> {
  const data:createGoalCompletionResponse = await fetch('http://localhost:1900/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
    }),
  }).then(e => e.json())
  return data
}
