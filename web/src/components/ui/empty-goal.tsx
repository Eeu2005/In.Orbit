import { Plus } from 'lucide-react'
import { Button } from './button'

import { DialogTrigger } from './dialog'
import logo from '../../assets/icon.svg'
import lestStart from '../../assets/lets-start.svg'

export function EmptyGoal() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="inOrbit" />
      <img src={lestStart} alt="start logo" />
      <p className="text-zinc-400 leading-relaxed text-center max-w-80">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>
      {/* <button type="button" className="px-4 py-2.5 rounded-lg  bg-violet-500 text-violet-50 flex items-center gap-2 text-sm font-medium tracking-tight transition-all hover:bg-violet-900 " ></button> */}

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 " />
          cadastrar meta
        </Button>
      </DialogTrigger>
    </div>
  )
}
