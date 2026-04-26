import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';

import Header from "../components/ui/Header";
const Footer = lazy(() => import("../components/ui/Footer"));

// Sections
import HeroSection from "../components/home/HeroSection";
import { lazy, Suspense } from "react";

const PopularCoursesSection = lazy(() => import("../components/home/PopularCoursesSection"));
const CategoriesSection = lazy(() => import("../components/home/CategoriesSection"));
const InstructorsSection = lazy(() => import("../components/home/InstructorsSection"));
const CtaSection = lazy(() => import("../components/home/CtaSection"));
import { api } from "../services/api/api";



// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, instructors: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Single combined endpoint — replaces 4 separate API calls
        const data = await api.get('/admin/home-data');
        setSettings(data.settings || null);
        setFeaturedCourses(data.featuredCourses || []);
        setInstructors(data.instructors || []);
        setStats(data.stats || { users: 0, courses: 0, instructors: 0 });
      } catch (err) {
        console.error("Home fetch error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-screen overflow-hidden font-outfit">
      <Helmet>
        <title>eduTech | Modern Learning Platform – 200+ Courses</title>
        <meta name="description" content="Access 200+ expert-led courses, workshops and events on eduTech. Learn programming, design, data science and more at your own pace." />
        <meta property="og:title" content="eduTech | Modern Learning Platform" />
        <meta property="og:description" content="200+ courses from expert instructors. Start learning today." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://edutech-5psu.vercel.app/" />
      </Helmet>
      <Header />
      <main>
        <HeroSection
          images={settings?.heroImages}
          stats={stats}
          subtitle={settings?.heroSubtitle}
        />
        <Suspense fallback={<div className="min-h-[600px] bg-gray-50 animate-pulse" />}>
          <PopularCoursesSection courses={featuredCourses} />
        </Suspense>

        <Suspense fallback={<div className="min-h-[400px] bg-white animate-pulse" />}>
          <CategoriesSection
            title={settings?.categoriesTitle}
            subtitle={settings?.categoriesSubtitle}
          />
        </Suspense>

        <Suspense fallback={<div className="min-h-[500px] bg-gray-50 animate-pulse" />}>
          <InstructorsSection
            instructors={instructors}
            title={settings?.instructorsTitle}
            subtitle={settings?.instructorsSubtitle}
          />
        </Suspense>

        <Suspense fallback={<div className="min-h-[600px] bg-gray-50 animate-pulse" />}>
          <CtaSection
            image={settings?.ctaImage}
            title={settings?.ctaTitle}
            subtitle={settings?.ctaSubtitle}
            buttonText={settings?.ctaButtonText}
            buttonLink={settings?.ctaButtonLink}
          />
        </Suspense>
      </main>
      <Suspense fallback={<div className="min-h-[300px] bg-white" />}>
        <Footer settings={settings} />
      </Suspense>
    </div>
  );
}
