import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { SessionMonitor } from "@/components/auth/session-monitor"

const inter = Inter({ subsets: ["latin"] })

// Envolver el contenido con AuthProvider:
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
             {/* <SessionMonitor showInDevelopment={false} /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
