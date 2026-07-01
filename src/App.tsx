/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import MenuSection from './components/MenuSection';
import ReviewsSection from './components/ReviewsSection';
import LocationHours from './components/LocationHours';
import ReservationSection from './components/Reservation';
import ContactSection from './components/Contact';
import Footer from './components/Footer';
import AuthPortal from './components/AuthPortal';
import { useApp } from './context/AppContext';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const { isAdminMode } = useApp();

  useEffect(() => {
    const sections = ['home', 'admin-dashboard-root', 'about', 'menu', 'reviews', 'location', 'contact', 'reservation'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section occupies the sweet middle spot
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [isAdminMode]);

  return (
    <div id="app-root-container" className="bg-stone-950 text-stone-100 min-h-screen relative font-sans selection:bg-amber-500 selection:text-stone-950 antialiased overflow-x-hidden">
      {/* Immersive Gateways & Authentication */}
      <AuthPortal />

      {/* Top Navigation */}
      <Navbar onNavigate={setActiveSection} activeSection={activeSection} />

      {/* Main content sections */}
      <main id="main-content-flow">
        {/* Cinematic Hero */}
        <Hero onNavigate={setActiveSection} />

        {/* Admin Dashboard Control Panel when active */}
        {isAdminMode && <AdminDashboard />}

        {/* Brand identity story */}
        <About />

        {/* Dynamic customized menu list */}
        <MenuSection />

        {/* Interactive feedback & reviews portal */}
        <ReviewsSection />

        {/* Location maps & operating hours */}
        <LocationHours />

        {/* Dynamic reservation pass ticket portal */}
        <ReservationSection />

        {/* Host coordinates & inquiry system */}
        <ContactSection />
      </main>

      {/* Sustainable footer aligned to core goals */}
      <Footer />
    </div>
  );
}
