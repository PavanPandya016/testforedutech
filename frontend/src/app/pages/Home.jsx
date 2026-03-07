import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";

// Sections
import HeroSection from "../components/home/HeroSection";
import PopularCoursesSection from "../components/home/PopularCoursesSection";
import CategoriesSection from "../components/home/CategoriesSection";
import InstructorsSection from "../components/home/InstructorsSection";
import CtaSection from "../components/home/CtaSection";

// ─── Constants ────────────────────────────────────────────────────────────────

const picsum = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const POPULAR_COURSES = [
  { id: 1, title: "UI/UX Design Masterclass", category: "Design", price: 500, rating: 5, reviews: 15, image: picsum("course1", 400, 250) },
  { id: 2, title: "Full Stack Development", category: "Development", price: 500, rating: 5, reviews: 20, image: picsum("course2", 400, 250) },
  { id: 3, title: "Digital Marketing Pro", category: "Marketing", price: 500, rating: 4, reviews: 102, image: picsum("course3", 400, 250) },
  { id: 4, title: "Data Science Essentials", category: "Data Science", price: 500, rating: 5, reviews: 89, image: picsum("course4", 400, 250) },
];

const CATEGORIES = [
  { name: "Design", icon: "bi-palette" },
  { name: "Development", icon: "bi-code-slash" },
  { name: "Marketing", icon: "bi-graph-up" },
  { name: "Business", icon: "bi-briefcase" },
  { name: "Lifestyle", icon: "bi-stars" },
  { name: "Photography", icon: "bi-camera" },
  { name: "Music", icon: "bi-music-note" },
  { name: "Data Science", icon: "bi-bar-chart" },
];

const INSTRUCTORS = [
  { id: 1, name: "Sarah Jones", specialty: "UI/UX Design", image: picsum("instructor1", 200, 200) },
  { id: 2, name: "Michael Chen", specialty: "Social Media", image: picsum("instructor2", 200, 200) },
  { id: 3, name: "Emily Davis", specialty: "Business Strategy", image: picsum("instructor3", 200, 200) },
  { id: 4, name: "David Wilson", specialty: "Photography", image: picsum("instructor4", 200, 200) },
  { id: 5, name: "Jessica Brown", specialty: "Music Production", image: picsum("instructor5", 200, 200) },
];

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-white flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <PopularCoursesSection courses={POPULAR_COURSES} />
        <CategoriesSection categories={CATEGORIES} />
        <InstructorsSection instructors={INSTRUCTORS} />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
