import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guilty Until Proven - AI Detective Investigation Game',
  description: 'Interrogate suspects and uncover hidden evidence to solve crimes. Use strategic questioning to discover clues in this AI-powered detective investigation game. Play free now!',
  keywords: 'detective game, investigation game, mystery game, AI detective, crime investigation, impostor game, who is guilty game, detective interrogation, mystery solving game, online detective game, free detective game, suspect interrogation, crime solver',
  
  // Open Graph (Facebook, LinkedIn, Discord)
  openGraph: {
    type: 'website',
    url: 'https://guiltyuntilproven.com',
    title: 'Guilty Until Proven - AI Detective Investigation Game',
    description: 'Interrogate suspects and uncover hidden evidence to solve crimes. Use strategic questioning to discover clues in this AI-powered detective game.',
    images: [
      {
        url: 'https://guiltyuntilproven.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Guilty Until Proven - Detective Game',
      },
    ],
    siteName: 'Guilty Until Proven',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Guilty Until Proven - AI Detective Investigation Game',
    description: 'Interrogate suspects and uncover hidden evidence to solve crimes. Use strategic questioning in this AI detective game.',
    images: ['https://guiltyuntilproven.com/og-image.png'],
  },
  
  // Additional
  robots: 'index, follow',
  alternates: {
    canonical: 'https://guiltyuntilproven.com',
  },
  
  // 🔥 ADD GOOGLE VERIFICATION HERE 🔥
  // Replace the content value with your actual verification code from Google Search Console
  verification: {
    google: '01Vm_HMFpKVt_YGrWdVNvVYwrnX1yJ-wNVpQWudcIjw',
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
