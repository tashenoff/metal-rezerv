// components/Layout.js
import React from 'react';
import Head from 'next/head';
import Header from './Header'; // Вы можете создать свой Header компонент
import Footer from './Footer'; // В
import DailyRewardChecker from './DailyRewardChecker';

const Layout = ({ children, title = "My Next.js App" }) => {
  return (
    <div className="flex bg-base-300 flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content="This is a Next.js app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* Основное содержимое с flex-grow, чтобы занимать оставшееся пространство */}
      <main className="flex-grow container mx-auto py-4">
        {children}
      </main>

      <Footer />
      
      {/* Компонент для проверки и отображения ежедневной награды */}
      <DailyRewardChecker />
    </div>
  );
};

export default Layout;
