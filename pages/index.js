import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/home/Layout';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import Features from '../components/home/Features';
import TargetAudience from '../components/home/TargetAudience';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('token', token); // Сохраняем токен в localStorage
      router.push('/listings'); // Перенаправляем на страницу объявлений
    } else {
      const { message } = await res.json();
      alert(message);
    }
  };

  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <Features />
      <TargetAudience />
      {/* <Testimonials /> */}
      <CallToAction />
    </Layout>
  );
}
