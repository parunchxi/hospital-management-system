import { EnvVarWarning } from '@/components/env-var-warning'
import HeaderAuth from '@/components/header-auth'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { hasEnvVars } from '@/utils/supabase/check-env-vars'
import { ThemeProvider } from 'next-themes'
import Link from 'next/link'
import './globals.css'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Hospital Management System',
  description:
    'A full-stack Hospital Management System built with Next.js, Supabase, Tailwind CSS, and ShadCN for CPE241 Final Project at KMUTT.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <header className="border-b bg-card text-card-foreground shadow-sm">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-xl font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 750 750"
                    className="h-7 w-7 text-primary"
                    fill="currentColor"
                  >
                    <defs>
                      <clipPath id="HMSLogo">
                        <path d="M 37.42 84.68 L 712.42 84.68 L 712.42 665.18 L 37.42 665.18 Z" />
                      </clipPath>
                    </defs>
                    <g clipPath="url(#HMSLogo)">
                      <path d="M 662.48 134.87 C 595.63 68.02 486.38 68.02 419.71 134.87 L 375.08 179.5 L 330.46 134.87 C 263.61 68.02 154.36 68.02 87.69 134.87 C 22.89 199.67 21.01 304.47 81.87 371.66 L 238.99 371.66 L 261.9 252.16 C 262.93 246.52 267.71 242.41 273.53 242.07 C 279.34 241.73 284.47 245.49 286.01 250.96 L 341.91 441.25 L 372.35 317.64 C 373.71 312.34 378.33 308.41 383.8 308.23 C 389.27 307.89 394.23 311.31 396.11 316.61 L 419.88 384.14 L 463.64 250.62 C 465.36 245.49 470.31 241.9 475.78 242.07 C 481.25 242.24 486.04 245.83 487.41 251.13 L 520.75 371.66 L 668.29 371.66 C 729.33 304.47 727.28 199.67 662.48 134.87 Z M 499.21 387.39 L 474.25 297.46 L 431.84 426.71 C 430.13 431.84 425.52 435.26 420.22 435.26 L 420.05 435.26 C 414.75 435.26 410.13 432.02 408.25 426.89 L 386.2 364.14 L 354.74 491.85 C 353.37 497.32 348.58 501.26 342.94 501.26 L 342.6 501.26 C 337.13 501.26 332.17 497.67 330.63 492.37 L 276.43 307.04 L 261.22 386.37 C 260.02 392.18 254.89 396.45 249.08 396.45 L 106.15 396.45 L 132.14 422.44 L 374.91 665.21 L 617.69 422.44 L 643.67 396.45 L 511 396.45 C 505.53 396.45 500.75 392.69 499.21 387.39 Z" />
                    </g>
                  </svg>
                  HMS
                </Link>
                <div className="flex items-center gap-4">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </div>
            </header>

            <main className="flex-1 container mx-auto">{children}</main>

            <footer className="border-t border-border text-muted-foreground text-xs text-center py-6">
              <div className="container mx-auto flex h-4 items-center justify-between px-4">
                <p>
                  Hospital Management System -{' '}
                  <a
                    href="https://github.com/parunchxi/hospital-management-system"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-primary"
                  >
                    GitHub
                  </a>
                </p>
                <ThemeSwitcher />
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
