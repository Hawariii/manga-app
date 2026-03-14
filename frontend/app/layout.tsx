import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from '../components/Navbar';

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Manga Haven',
  description: 'Read manga with a clean, fast reader experience.',
  openGraph: {
    title: 'Manga Haven',
    description: 'Read manga with a clean, fast reader experience.',
    type: 'website',
    url: '/'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f9f3e4_0%,_#f5f7f7_55%,_#eef1f2_100%)]">
          <div className="flex min-h-screen flex-col md:flex-row">
            <Navbar />
            <main className="flex-1 px-5 py-10 md:px-10">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
