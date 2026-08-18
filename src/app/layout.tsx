import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Student Management System — Registry Module',
  description: 'Next.js 14+ Registry Management System with PostgreSQL and Prisma ORM',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="corporate">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-5 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
