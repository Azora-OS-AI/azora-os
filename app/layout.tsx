/*
AZORA PROPRIETARY LICENSE

Copyright © 2025 Azora ES (Pty) Ltd. All Rights Reserved.

See LICENSE file for details.
*/

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Azora OS - Universal Human Infrastructure',
  description: "Africa's Quantum-Secure Intelligence Ecosystem. Empowering 1.4 billion Africans across 54 countries.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.ico',
  },
  keywords: ['Azora OS', 'AI', 'Africa', 'Operating System', 'Quantum Security', 'Universal Infrastructure'],
  authors: [{ name: 'Azora ES (Pty) Ltd' }],
  creator: 'Azora ES (Pty) Ltd',
  publisher: 'Azora ES (Pty) Ltd',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Azora OS - Universal Human Infrastructure',
    description: "Africa's Quantum-Secure Intelligence Ecosystem",
    siteName: 'Azora OS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Azora OS',
    description: "Africa's Quantum-Secure Intelligence Ecosystem",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
