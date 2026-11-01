import Image from 'next/image'

export function SomaLogo({ className = '' }: { className?: string }) {
  return <Image src="/soma-logo.png" alt="" width={48} height={48} className={`h-12 w-12 shrink-0 object-contain ${className}`} />
}