export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex flex-col relative overflow-hidden">
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="blob animate-blob w-[300px] h-[300px] bg-indigo-200 dark:bg-indigo-900/30 top-[-50px] left-[-50px]" />
        <div className="blob animate-blob w-[400px] h-[400px] bg-pink-200 dark:bg-pink-900/20 bottom-[-100px] right-[-100px] [animation-delay:2s]" />
        <div className="blob animate-blob w-[250px] h-[250px] bg-blue-200 dark:bg-blue-900/30 top-[40%] right-[-50px] [animation-delay:4s]" />
      </div>

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10">
        {children}
      </main>
    </div>
  )
}
