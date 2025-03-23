import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import SignMovement from '@/components/common/animated-3d/sign-movement';
import ReadText from '@/components/common/read-text';

const montserrat = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-montserrat',
  weight: '100 900',
});
const powerGotesk = localFont({
  src: './fonts/PowerGrotesk-Regular.ttf',
  variable: '--font-power-gotesk',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: "Hp-M'Boss",
  description: 'Handicape - Education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${powerGotesk.variable} antialiased`}
      >
        {children}
        <SignMovement />
        <ReadText />
      </body>
    </html>
  );
}
