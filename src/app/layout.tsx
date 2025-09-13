import './globals.css';
export const metadata = {
  title: 'Grid World Value Iteration Simulator',
  description: 'Interactive reinforcement learning simulator for visualizing value iteration algorithms in a 4x3 grid world environment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-background/60 backdrop-blur">
        {children}
      </body>
    </html>
  )
}
