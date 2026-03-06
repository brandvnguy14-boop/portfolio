import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NEUROS // Brandon Nguyen',
  description: 'Medical terminal interface. Neuroscience @ UVA. Builder of health tech.',
  keywords: ['Brandon Nguyen', 'neuroscience', 'pre-med', 'UVA', 'health technology', 'SnapRx', 'MicroBloom'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        {children}
        <div className="med-overlay" aria-hidden="true" />
      </body>
    </html>
  )
}
