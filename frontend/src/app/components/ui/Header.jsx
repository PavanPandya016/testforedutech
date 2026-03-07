import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import svgPaths from "../../../imports/svg-go1x4xx39u";

/* =========================
   Lock Icon Component
========================= */
function Lock() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path
          d={svgPaths.p21f4c00}
          stroke="#6D737A"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d={svgPaths.p1ecc26b0}
          stroke="#6D737A"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path d={svgPaths.p1a395f00} fill="#6D737A" />
      </svg>
    </div>
  );
}

/* =========================
   Header Component
========================= */
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  /* =========================
     Logout Handler
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("applicantName");
    localStorage.removeItem("applicantEmail");
    localStorage.removeItem("applicantPhone");
    localStorage.removeItem("applicantEducation");
    localStorage.removeItem("applicantCourse");
    
    setIsLoggedIn(false);
    setUserName("");
    setIsMenuOpen(false);
    navigate("/");
  };

  /* =========================
     Auth Check
  ========================= */
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const name =
      localStorage.getItem("userName") ||
      localStorage.getItem("userEmail")?.split("@")[0] ||
      "User";

    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, [location.pathname]);

  /* Close mobile menu when route changes */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  /* =========================
     Navigation Links
  ========================= */
  const baseLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/courses", label: "Courses" },
    { path: "/blog", label: "Blog" },
    { path: "/workshop", label: "Workshop" },
  ];
  
  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  /* =========================
     JSX
  ========================= */
  return (
    <motion.div
      className="bg-white w-full shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          {/* =========================
             Logo
          ========================= */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="text-[48px] font-bold italic font-['PT_Serif',serif]"
            >
              <span className="text-[#14627a]">edu</span>
              <span className="text-[#ffc27a]">Tech</span>
            </Link>
          </motion.div>

          {/* =========================
             Desktop Navigation
          ========================= */}
          <div className="hidden lg:flex items-center gap-2">
            {baseLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <Link
                  to={link.path}
                  className={`px-5 py-2 rounded-lg transition-all ${
                    isActive(link.path)
                      ? "bg-[#14627a] text-white"
                      : "text-gray-600 hover:text-[#14627a] hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* =========================
             Desktop Auth
          ========================= */}
          <div className="hidden lg:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <Lock />
                  <span className="text-gray-600">Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="bg-[#14627a] text-white px-5 py-2 rounded-lg hover:bg-[#0f4a5b]"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-100">
                  <div className="w-8 h-8 bg-[#14627a] rounded-full flex items-center justify-center text-white font-semibold">
                    {userName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* =========================
             Mobile Menu Button
          ========================= */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* =========================
         Mobile Menu
      ========================= */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-white border-b shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-2">
              {baseLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg ${
                    isActive(link.path)
                      ? "bg-[#14627a] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 bg-[#14627a] text-white text-center rounded-lg mt-2"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="px-4 py-3 bg-gray-100 rounded-lg">
                      <p className="font-medium">{userName}</p>
                      <p className="text-sm text-gray-500">Logged in</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
