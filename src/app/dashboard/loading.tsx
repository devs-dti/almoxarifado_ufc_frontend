export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}
