import { Inter, Montserrat } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/redux/providers";
import ThemeAwareLayout from '@/components/ThemeAwareLayout';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400'],
});

export const metadata = {
  title: "Cryptonite",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/crypt.png" type="image/png" />
      </head>
      <body className={`${inter.className} ${montserrat.className}`}>
        <Providers>
          <ThemeAwareLayout>
            {children}
          </ThemeAwareLayout>
        </Providers>
      </body>
    </html>
  );
}