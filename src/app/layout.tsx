import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'IntentOS — Autonomous AI Sales Intelligence Platform',
  description:
    'Turn public buying signals into sales-ready opportunities. Discover RFP requirements, qualify leads with AI, and automate outreach.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#F5F7FA] text-[#102A43] antialiased`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
