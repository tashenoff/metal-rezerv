// components/Layout.js
import React from 'react';
import Head from 'next/head';
import Header from './Header'; // Вы можете создать свой Header компонент
// import Footer from './Footer'; // Вы можете создать свой Footer компонент

const Layout = ({ children, title = "My Next.js App" }) => {
  return (
    <div className='bg-gray-200'>
      <Head>
        <title>{title}</title>
        <meta name="description" content="This is a Next.js app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="container mx-auto p-4">
        {children}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
