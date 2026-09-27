import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rexton.com'),
  title: {
    default: 'REXTON WATCHES | Swiss Timeless Root | Luxury Timepieces & Chronographs',
    template: '%s | REXTON WATCHES',
  },
  description:
    'Discover REXTON Swiss-engineered luxury timepieces, high-beat automatic chronographs, diving instruments, and haute horlogerie tourbillons with 5-year international warranty.',
  keywords: [
    'REXTON Watches',
    'Swiss luxury watches',
    'Automatic Chronographs',
    'Haute Horlogerie',
    'Diving Watches 300M',
    'Tourbillon watches',
    'Mechanical Timepieces',
  ],
  authors: [{ name: 'REXTON WATCHES SA' }],
  creator: 'REXTON Atelier',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rexton.com',
    title: 'REXTON WATCHES | Swiss Timeless Root',
    description: 'Precision mechanical Swiss timepieces crafted in Geneva & La Chaux-de-Fonds.',
    siteName: 'REXTON WATCHES',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'REXTON Swiss Timepiece Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REXTON WATCHES | Swiss Timeless Root',
    description: 'Precision mechanical Swiss timepieces crafted in Geneva & La Chaux-de-Fonds.',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-neutral-900">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
