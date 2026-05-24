'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { label: 'Materiais', href: '/dashboard/materiais' },
  { label: 'Relatórios', href: '/dashboard/relatorios' },
  { label: 'Setores', href: '/dashboard/setores' },
  { label: 'Unidades de Medida', href: '/dashboard/unidades-de-medida' },
  { label: 'Fornecedores', href: '/dashboard/fornecedores' },
  { label: 'Usuários', href: '/dashboard/usuarios' },
]

export default function Slider() {
  const pathname = usePathname()

  return (
    <div className="flex items-center overflow-y-hidden overflow-x-auto px-4 py-4 scrollbar-hide">
      <ul className="flex items-center flex-row flex-nowrap gap-x-4 w-max">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-100 ease-in-out ${
                  isActive ? 'text-white bg-brand-active' : 'text-[#938F8F] hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
