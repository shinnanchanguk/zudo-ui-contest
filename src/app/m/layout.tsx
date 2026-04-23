export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
