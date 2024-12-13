import type { Metadata } from "next";
import { Poppins } from 'next/font/google'
import "./globals.css";
import { RootProviders } from "./providers";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Briefly",
  description: "Encyclopedia summarized and explained.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${poppins.className} antialiased dark:bg-[#232323] bg-white transition`}>
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
};