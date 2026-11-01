import Image from 'next/image'

export function UfcLogo({ className = '' }: { className?: string }) {
  return <Image src="/ufc-brasao.png" alt="Brasão da Universidade Federal do Ceará" width={40} height={64} className={`h-12 w-auto object-contain ${className}`} />
}
