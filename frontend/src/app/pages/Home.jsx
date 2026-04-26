import { useState, useEffect } from "react";

import Header from "../components/ui/Header";
const Footer = lazy(() => import("../components/ui/Footer"));

// Sections
import HeroSection from "../components/home/HeroSection";
import { lazy, Suspense } from "react";

const PopularCoursesSection = lazy(() => import("../components/home/PopularCoursesSection"));
const CategoriesSection = lazy(() => import("../components/home/CategoriesSection"));
const InstructorsSection = lazy(() => import("../components/home/InstructorsSection"));
const CtaSection = lazy(() => import("../components/home/CtaSection"));
import adminService from "../services/adminService";
import courseService from "../services/courseService";
import instructorService from "../services/instructorService";



// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [stats, setStats] = useState({ users: 0, courses: 0, instructors: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          adminService.getSiteSettings(),
          courseService.getFeaturedCourses(),
          instructorService.getInstructors(),
          adminService.getPublicStats()
        ]);

        // Handle Site Settings
        if (results[0].status === 'fulfilled') {
          setSettings(results[0].value || null);
        }

        // Handle Featured Courses
        if (results[1].status === 'fulfilled') {
          setFeaturedCourses(results[1].value || []);
        }

        // Handle Instructors
        if (results[2].status === 'fulfilled') {
          setInstructors(results[2].value || []);
        }

        // Handle Stats
        if (results[3].status === 'fulfilled') {
          const statsData = results[3].value;
          setStats(statsData?.stats || { users: 0, courses: 0, instructors: 0 });
        } else {
          console.warn("Stats fetch failed, using default values.");
        }

      } catch (err) {
        console.error("Home fetch error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-screen overflow-hidden font-outfit">
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
