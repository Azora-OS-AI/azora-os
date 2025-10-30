import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Azora OS - Constitutional AI Platform',
  description: 'Planetary-scale economic intelligence platform with constitutional AI governance, sovereign digital economy, and zero-trust architecture',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Azora OS',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Azora OS',
    title: 'Azora OS - Constitutional AI Platform',
    description: 'Planetary-scale economic intelligence with constitutional governance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azora OS',
    description: 'Constitutional AI Platform for planetary-scale economics',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c4a6e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="application-name" content="Azora OS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Azora OS" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        
        {/* Advanced Features Integration */}
        <Script
          id="azora-integration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Azora OS Advanced Features
              window.addEventListener('azora:ready', (event) => {
                console.log('✅ Azora OS Ready:', event.detail);
              });
              
              window.addEventListener('azora:update-available', () => {
                console.log('🔄 Update available');
              });
              
              window.addEventListener('azora:install-prompt', (event) => {
                console.log('📱 Install prompt available');
              });
            `,
          }}
        />
        
        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('✅ Service Worker registered'))
                    .catch(err => console.log('❌ SW registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}