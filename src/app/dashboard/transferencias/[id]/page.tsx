import { TransferDetails } from '@/features/transfers/components/TransferDetails'

export default async function TransferDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TransferDetails id={id} />
}
