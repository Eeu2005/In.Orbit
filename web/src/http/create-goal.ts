interface Goal {
  title: string
  desiredWeeklyFrequency: number
}
export async function createGoal(
  {desiredWeeklyFrequency,title}:Goal
) {
   await fetch(
    'http://localhost:1900/goals',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title,
        desiredWeeklyFrequency
      }),
    }
  )
}