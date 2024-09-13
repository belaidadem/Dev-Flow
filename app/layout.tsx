/* eslint-disable camelcase */
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Space_Grotesk } from 'next/font/google';
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import type { Metadata } from 'next';

import './globals.css';
import '../styles/prism.css';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk'
});

export const metadata: Metadata = {
  title: 'DevOverflow',
  description:
    'A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.',
  icons: {
    icon: '/assets/images/site-logo.svg'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Inline script to set initial theme
  const setInitialTheme = `
    (function() {
      const getInitialTheme = () => {
        if (localStorage.theme) {
          return localStorage.getItem('theme');
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      };
      const theme = getInitialTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
    })();
  `;

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'primary-gradient',
          footerActionLink: 'primary-text-gradient hover:text-primary-500'
        }
      }}
    >
      <html lang='en'>
<<<<<<< Updated upstream
=======
        <head>
          {/* This script ensures theme is set before page render */}
          <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        </head>
>>>>>>> Stashed changes
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
