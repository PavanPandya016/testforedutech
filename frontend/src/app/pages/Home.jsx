import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

// Sections
import HeroSection from "../components/home/HeroSection";
import PopularCoursesSection from "../components/home/PopularCoursesSection";
import CategoriesSection from "../components/home/CategoriesSection";
import InstructorsSection from "../components/home/InstructorsSection";
import CtaSection from "../components/home/CtaSection";
import adminService from "../services/adminService";
import courseService from "../services/courseService";
import instructorService from "../services/instructorService";



// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sData = await adminService.getSiteSettings();
        setSettings(sData || null);
        const cData = await courseService.getFeaturedCourses();
        setFeaturedCourses(cData);
        const iData = await instructorService.getInstructors();
        setInstructors(iData);
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
        <HeroSection images={settings?.heroImages} />
        <PopularCoursesSection courses={featuredCourses} />
        <CategoriesSection />
        <InstructorsSection instructors={instructors} />
        <CtaSection image={settings?.ctaImage} />
      </main>
      <Footer />
    </div>
  );
}
