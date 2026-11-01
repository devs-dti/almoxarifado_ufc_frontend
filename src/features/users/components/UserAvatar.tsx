'use client'

import { useState } from 'react'
import { UserRound } from 'lucide-react'

export function UserAvatar({ src, name, large = false }: { src?: string | null; name: string; large?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const size = large ? 'h-24 w-24' : 'h-11 w-11'
  return <span className={`${size} grid shrink-0 place-items-center overflow-hidden rounded-full border border-violet-100 bg-violet-50 text-violet-700`}>{src && failedSrc !== src ? <img src={src} alt={`Foto de ${name}`} className="h-full w-full object-cover" onError={() => setFailedSrc(src)} /> : <UserRound size={large ? 40 : 20} aria-label={`Sem foto de ${name}`} />}</span>
}
