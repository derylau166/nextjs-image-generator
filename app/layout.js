import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DERY LAU AI',
  description: 'AI Image Generator by Dery Lau, powered by Pollinations API.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>DERY LAU AI - Image Generator</title>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
