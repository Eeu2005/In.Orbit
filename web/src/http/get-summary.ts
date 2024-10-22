type SummaryResponse = {
  completed: number
  total: number
  goalsPerDay: Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
}
export async function getSummary():Promise<SummaryResponse> {
 const data  =await (await fetch('http://localhost:1900/week-summary')).json()
 console.log(data)
    return data.summary
  
}