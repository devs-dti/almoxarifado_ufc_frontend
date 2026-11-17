import Image from 'next/image'

export function SigmaLogo({ className = '' }: { className?: string }) {
  return <Image src="/sigma-logo.png" alt="" width={48} height={48} className={`h-12 w-12 shrink-0 object-contain ${className}`} />
}
