'use client'

import { forwardRef, useId, useRef, useState, type ComponentPropsWithoutRef } from 'react'
import { Popover } from 'radix-ui'
import { useQuery } from '@tanstack/react-query'
import { useDebounceValue } from 'usehooks-ts'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaginatedResponse } from '@/shared/types/pagination'
import { Button } from './button'
import { Input } from './input'

export type SearchSelectOption = { id: string; label: string; disabled?: boolean }
export type SearchSelectParams = { search: string; page: number; size: number; sort: string }

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onChange'> & {
  value: SearchSelectOption | null
  onValueChange: (option: SearchSelectOption) => void
  queryKey: string
  loadOptions: (params: SearchSelectParams) => Promise<PaginatedResponse<SearchSelectOption>>
  placeholder: string
  searchPlaceholder: string
  emptyOption?: SearchSelectOption
}

export const AsyncSearchSelect = forwardRef<HTMLButtonElement, Props>(function AsyncSearchSelect({
  value, onValueChange, queryKey, loadOptions, placeholder, searchPlaceholder, emptyOption,
  className, disabled, ...triggerProps
}, ref) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [debouncedSearch] = useDebounceValue(search.trim(), 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const isDebouncing = search.trim() !== debouncedSearch
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: [queryKey, 'select', { search: debouncedSearch, page }],
    queryFn: () => loadOptions({ search: debouncedSearch, page, size: 10, sort: 'name,asc' }),
    enabled: open && !isDebouncing,
    staleTime: 30_000,
    retry: false,
  })
  const busy = isDebouncing || isPending || isFetching
  const options = [
    ...(emptyOption ? [emptyOption] : []),
    ...(!busy && !isError ? data?.content ?? [] : []),
  ]

  function changeOpen(next: boolean) {
    setOpen(next)
    if (next) {
      setSearch('')
      setPage(0)
      setActiveIndex(-1)
    }
  }

  function select(option: SearchSelectOption) {
    if (option.disabled) return
    onValueChange(option)
    setOpen(false)
  }

  function moveActive(direction: number) {
    let next = activeIndex < 0 && direction < 0 ? 0 : activeIndex
    for (let count = 0; count < options.length; count++) {
      next = (next + direction + options.length) % options.length
      if (!options[next].disabled) {
        setActiveIndex(next)
        document.getElementById(`${listId}-${next}`)?.scrollIntoView({ block: 'nearest' })
        return
      }
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={changeOpen}>
      <Popover.Trigger asChild>
        <button
          {...triggerProps}
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="dialog"
          disabled={disabled}
          className={cn('flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm shadow-xs outline-none transition-colors hover:border-violet-300 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-200 aria-invalid:border-red-500 disabled:cursor-not-allowed disabled:opacity-50', className)}
        >
          <span className={cn('min-w-0 truncate', !value && !emptyOption && 'text-slate-500')}>
            {value?.label ?? emptyOption?.label ?? placeholder}
          </span>
          <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-slate-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 flex max-h-[min(26rem,var(--radix-popover-content-available-height))] w-[var(--radix-popover-trigger-width)] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          aria-label={searchPlaceholder}
          onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current?.focus() }}
        >
          <div className="relative shrink-0">
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
            <Input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-label={searchPlaceholder}
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 && options[activeIndex] ? `${listId}-${activeIndex}` : undefined}
              value={search}
              placeholder={searchPlaceholder}
              className="h-10 pl-9 text-sm"
              onChange={(event) => { setSearch(event.target.value); setPage(0); setActiveIndex(-1) }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault()
                  moveActive(event.key === 'ArrowDown' ? 1 : -1)
                } else if (event.key === 'Enter') {
                  event.preventDefault()
                  if (activeIndex >= 0 && options[activeIndex]) select(options[activeIndex])
                }
              }}
            />
          </div>
          <div id={listId} role="listbox" aria-label="Resultados da busca" aria-busy={busy} className="mt-2 min-h-0 overflow-y-auto overscroll-contain">
            {options.map((option, index) => (
              <button
                key={option.id}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={(value?.id ?? '') === option.id}
                aria-disabled={!!option.disabled}
                disabled={option.disabled}
                tabIndex={-1}
                className={cn('flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40', activeIndex === index && 'bg-violet-50', (value?.id ?? '') === option.id && 'font-medium text-violet-700')}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(option)}
              >
                <span className="min-w-0 break-words">{option.label}</span>
                {(value?.id ?? '') === option.id && <Check size={16} aria-hidden="true" className="shrink-0" />}
              </button>
            ))}
          </div>
          {busy ? <p role="status" className="px-3 py-4 text-sm text-slate-500">Buscando...</p>
            : isError ? <div role="alert" className="space-y-2 px-3 py-3 text-sm text-slate-600"><p>Não foi possível carregar as opções.</p><Button type="button" variant="outline" size="sm" onClick={() => refetch()}>Tentar novamente</Button></div>
              : !data?.content.length && <p role="status" className="px-3 py-4 text-sm text-slate-500">{search.trim() ? 'Nenhum resultado para esta busca.' : 'Nenhum cadastro disponível.'}</p>}
          {!busy && !isError && data && data.totalPages > 1 && (
            <div className="mt-2 flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 pt-2">
              <span className="text-xs text-slate-500">Página {page + 1} de {data.totalPages}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label="Página anterior de opções" disabled={page === 0} onClick={() => { setPage(page - 1); setActiveIndex(-1) }}><ChevronLeft size={16} aria-hidden="true" /></Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Próxima página de opções" disabled={page + 1 >= data.totalPages} onClick={() => { setPage(page + 1); setActiveIndex(-1) }}><ChevronRight size={16} aria-hidden="true" /></Button>
              </div>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
})
