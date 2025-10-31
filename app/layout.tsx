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
  title: 'Azora OS - Quantum-Secure Intelligence Ecosystem',
  description: 'Universal Human Infrastructure Platform. Be Everywhere. Help Everyone. Solve Everything.',
  icons: {
    icon: '/images/icons/azora-os-icon-geometric.svg',
    apple: '/images/icons/azora-os-icon-geometric.svg',
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
