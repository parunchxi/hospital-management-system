export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex justify-center p-6 sm:max-w-md mx-auto">
      {children}
    </div>
  )
}
