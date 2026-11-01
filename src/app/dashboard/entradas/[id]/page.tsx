import { EntryDetails } from '@/features/entries/components/EntryDetails'

export default async function EntryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EntryDetails id={id} />
}
