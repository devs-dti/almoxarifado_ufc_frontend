import { EntryList } from '@/features/entries/components/EntryList'

export default function EntradasPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-in fade-in duration-300">
      <EntryList />
    </div>
  )
}
