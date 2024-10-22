import './app.css'
import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/ui/create-dialog'
import { Summary } from './components/ui/summary'
import { EmptyGoal } from './components/ui/empty-goal'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from './http/get-summary'
export function App() {
const {data,} = useQuery({
  queryKey:['summary'],
  queryFn: getSummary,
  staleTime:1000*60
})
  return (
    <Dialog>
       { data && data?.total >0 ?<Summary/> :  <EmptyGoal/> }
     <CreateGoal/>
    </Dialog>
  )
}
