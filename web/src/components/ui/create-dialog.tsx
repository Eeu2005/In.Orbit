import { X } from 'lucide-react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog'
import { Label } from './label'
import { Input } from './input'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from './radio-group'
import { Button } from './button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGoal } from '../../http/create-goal'
import { useQueryClient } from '@tanstack/react-query'
const createGoalForm = z.object({
  title: z.string().min(1, 'digite a atividade desejada'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})
 type CreateGoalForm = z.infer<typeof createGoalForm>
export function CreateGoal() {
  const { register, control, handleSubmit, formState ,reset } = useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    })
 const queryClient = useQueryClient()

 async function handleCreateGoal(data: CreateGoalForm) {
  
    await createGoal({
      desiredWeeklyFrequency: data.desiredWeeklyFrequency,
      title: data.title,
    })
     queryClient.invalidateQueries({ queryKey: ['summary'] })
     queryClient.invalidateQueries({ queryKey: ['PendingGoals'] })
     reset()
  }
  return (
    <DialogContent>
      <div className="flex flex-col gap-8 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between  ">
            <DialogTitle>Cadastrar Metas </DialogTitle>
            <DialogClose>
              {' '}
              <X className="size-5  text-zinc-300" />
            </DialogClose>
          </div>
          <DialogDescription>
            Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora
            mesmo?
          </DialogDescription>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className=" flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className=" flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="praticar exercicios,medirar,etc"
                {...register('title')}
              />
              {formState.errors.title && (
                <p className="text-red-400 text-sm">
                  {formState.errors.title.message}{' '}
                </p>
              )}
            </div>
            <div className=" flex flex-col gap-2">
              <Label htmlFor="title">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                defaultValue={2}
                name="desiredWeeklyFrequency"
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}>
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          1 x na semana
                        </span>
                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          2 x na semana
                        </span>
                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          3 x na semana
                        </span>
                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          4 x na semana
                        </span>
                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          5 x na semana
                        </span>
                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          6 x na semana
                        </span>
                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>
                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Todos os dias da semana
                        </span>
                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button className="flex-1" variant="secondary" type="button">
                Fechar
              </Button>
            </DialogClose>
            <Button className="flex-1">Enviar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
