import { DialogTrigger } from './dialog'
import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './button'
import { InOrbitLogo } from './in-orbit-logo'
import { Progress, ProgressIndicator } from './progress-bar'
import { Separator } from './separator'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../../http/get-summary'
import dayjs from 'dayjs'
import ptBr from "dayjs/locale/pt-br"
import { PendingGoals } from './pending-goals'
import { Desfazer } from './desfazer'
dayjs.locale(ptBr)
export function Summary() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60,
  })
  if(!data) return null
  console.log(data)
  const completePerc = Math.round(data.completed  *100 / data.total)
  const firstDayOfWeek  = dayjs().startOf("week").format("D MMMM")
  const lastDayOfWeek  = dayjs().endOf("week").format("D MMMM")
  return (
    <div className=" py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className=" flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <InOrbitLogo />
          <span className=" text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button className="sm">
            <Plus className="size-4 " />
            cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completePerc}%` }} />
        </Progress>
        <div className=" flex items-center justify-between text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data.completed}</span> de{' '}
            <span className="text-zinc-100">{data.total}</span> metas esta
            semana{' '}
          </span>
          <span>{completePerc}%</span>
        </div>
      </div>
      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {data.goalsPerDay ? (
          Object.entries(data.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const formatedDate = dayjs(date).format('D [de] MMMM')
            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium ">
                  <span className="capitalize">{weekDay}</span>{' '}
                  <span className="text-zinc-400 text-xs">
                    ({formatedDate})
                  </span>{' '}
                </h3>
                <ul className="flex flex-col gap-3">
                  {goals.map(goal => {
                    console.log(goal)
                    const time = dayjs(goal.completedAt).format('HH:mm:ss')
                    return (
                      <li key={goal.id} className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-pink-500" />
                        <span className="text-sm text-zinc-400">
                          Você completou{' '}
                          <span className="text-zinc-100">{goal.title}</span> as{' '}
                          <span className="text-zinc-100">{time}</span>
                        </span>
                        <Desfazer
                          createdAt={goal.completedAt}
                          goalId={goal.id}
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })
        ) : (
          <h1 className='text-zinc-400'>Você ainda não completou nenhuma meta essa semana.</h1>
        )}
      </div>
    </div>
  )
}
