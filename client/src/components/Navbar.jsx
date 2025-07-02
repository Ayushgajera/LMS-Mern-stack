import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBookOpen, FiGrid, FiUser, FiBell, FiLogOut, FiEdit2, FiSettings } from 'react-icons/fi';
import { FiBook, FiAward, FiBarChart2, FiHeart, FiDownload, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { useSelector, useDispatch } from 'react-redux';
import { userLoggedOut } from "@/features/authslice"; // adjust path if needed

const menuItems = [
  {
    to: "/profile",
    icon: <FiBarChart2 className="w-4 h-4 text-green-600" />,
    label: "profile",
    bgColor: "bg-green-100"
  },
  {
    to: "/my-courses",
    icon: <FiBook className="w-4 h-4 text-emerald-600" />,
    label: "My Courses",
    bgColor: "bg-emerald-100",
    badge: {
      content: "3",
      className: "px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full"
    }
  },
  {
    to: "/messages",
    icon: <FiMessageSquare className="w-4 h-4 text-green-600" />,
    label: "Messages",
    bgColor: "bg-green-100",
    badge: {
      content: "",
      className: "h-2 w-2 bg-red-500 rounded-full"
    }
  },
  {
    to: "/calendar",
    icon: <FiCalendar className="w-4 h-4 text-emerald-600" />,
    label: "Calendar",
    bgColor: "bg-emerald-100"
  },

];

// Add this utility function at the top of your file
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutUser, { data, isLoading }] = useLogoutUserMutation();
  const userData = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log(userData);
  console.log(isAuthenticated)

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      // Add error toast here if you have a toast system
    }
  }
  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 20);
    }, 100); // Only run every 100ms

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add effect to close menus on route change
  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Modify the menu item click handler
  const handleMenuItemClick = (path) => {
    navigate(path);
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Update the menu items rendering in profile dropdown
  const renderMenuItems = menuItems.map((item, index) => (
    <button
      key={index}
      onClick={() => handleMenuItemClick(item.to)}
      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-gray-700
        hover:bg-gray-50 hover:text-green-600 transition-all duration-200 w-full text-left"
    >
      <div className={`p-2 rounded-lg ${item.bgColor}`}>
        {item.icon}
      </div>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className={item.badge.className}>
          {item.badge.content}
        </span>
      )}
    </button>
  ));

  // Right side menu renderer
  const renderAuthButtons = () => {
    if (userData&&isAuthenticated) {
      return (
        <div className="hidden md:flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors duration-200">
            <FiBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-100/80 
                transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              <img
                className="h-9 w-9 rounded-full ring-2 ring-green-500 object-cover"
                src={userData?.photoUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop"}
                alt={userData?.name || "User"}
              />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-700">{userData?.name}</span>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="fixed right-4 mt-2 w-[320px] bg-white rounded-2xl shadow-xl py-3 border border-gray-100 
                    profile-dropdown overflow-y-auto z-[100]"
                  style={{
                    maxHeight: 'calc(100vh - 80px)',
                    top: '64px'
                  }}
                >
                  {/* User Info Section - Enhanced */}
                  <div className="px-4 py-3">
                    <div className="flex items-start space-x-4">
                      <div className="relative group">
                        <img
                          className="h-16 w-16 rounded-xl ring-2 ring-green-500/30 object-cover group-hover:ring-green-500 transition-all duration-200"
                          src={userData?.photoUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop"}
                          alt="User"
                        />
                        <button className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-green-500 text-white 
                          shadow-lg hover:bg-green-600 transition-colors duration-200">
                          <FiEdit2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-800">{userData?.name|| 'Guest'}</h4>
                        <p className="text-sm text-gray-500">{userData?.email || 'Guest'}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Student Level</span>
                            <span>Level 4</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-[85%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats - Enhanced */}
                  <div className="grid grid-cols-3 gap-1 px-3 ">
                    <div className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FiBook className="w-3 h-3 text-green-600" />
                      </div>
                      <p className="text-md font-semibold text-gray-800">12</p>
                      <p className="text-xs text-gray-500">Courses</p>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <FiBarChart2 className="w-3 h-3 text-emerald-600" />
                      </div>
                      <p className="text-md font-semibold text-gray-800">85%</p>
                      <p className="text-xs text-gray-500">Progress</p>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="bg-green-100 p-2 rounded-lg ">
                        <FiAward className="w-3 h-3 text-green-600" />
                      </div>
                      <p className="text-md font-semibold text-gray-800">8</p>
                      <p className="text-xs text-gray-500">Certificates</p>
                    </div>
                  </div>

                  {/* Menu Items - Enhanced */}
                  <div className="px-2">
                    {renderMenuItems}
                  </div>

                  {/* Footer Actions - Enhanced */}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                    <Link
                      to="/settings"
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-gray-700
                        hover:bg-gray-50 hover:text-green-600 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-gray-100">
                        <FiSettings className="w-4 h-4" />
                      </div>
                      <span>Settings</span>
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-red-600 w-full
                        hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-red-100">
                        <FiLogOut className="w-4 h-4" />
                      </div>
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-3">
        <Link
          to="/login"
          className="px-4 py-2 border border-green-600 text-green-600 bg-white rounded-lg font-semibold hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow"
        >
          Sign Up
        </Link>
      </div>
    );
  };

  // Mobile menu renderer
  const renderMobileAuth = () => {
    if (userData) {
      return (
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={userData?.photoUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop"}
              alt={userData?.name || "User"}
              className="h-12 w-12 rounded-full ring-2 ring-green-500"
            />
            <div>
              <h4 className="text-sm font-semibold text-gray-800">{userData?.name}</h4>
              <p className="text-xs text-gray-500">{userData?.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Link to="/settings" className="mobile-nav-link">
              <FiSettings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="mobile-nav-link w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-gray-100 px-4 py-4 space-y-2">
        <Link 
          to="/login"
          className="mobile-nav-link"
        >
          <FiUser className="w-5 h-5" />
          <span>Login</span>
        </Link>
        <Link
          to="/register"
          className="mobile-nav-link bg-green-600 text-white hover:bg-green-700"
        >
          <FiUser className="w-5 h-5" />
          <span>Sign Up</span>
        </Link>
      </div>
    );
  };


  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 
      ${isScrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FiBook className="w-8 h-8 text-emerald-600" />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
              >
                EduLearn
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center ml-8 space-x-1">
              <NavLink to="/courses">
                <FiBookOpen className="mr-2" />
                Courses
              </NavLink>

              <div className="relative group">
                <NavLink to="/categories" className="group">
                  <FiGrid className="mr-2" />
                  Categories
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </NavLink>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  {['Web Development', 'Design', 'Business', 'Marketing'].map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                    >
                      {category}
                    </Link>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-2 lg:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-xl border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  bg-gray-50/50 backdrop-blur-sm transition-all duration-200"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right Side Menu */}
          {renderAuthButtons()}

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-100 
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-100 shadow-lg"
          >
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-xl border border-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    bg-gray-50/50"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-3 space-y-1">
              <Link to="/courses" className="mobile-nav-link">
                <FiBookOpen className="w-5 h-5" />
                <span>Courses</span>
              </Link>

              {/* Mobile Categories Accordion */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="mobile-nav-link w-full flex justify-between"
                >
                  <div className="flex items-center">
                    <FiGrid className="w-5 h-5" />
                    <span>Categories</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-9 space-y-1"
                    >
                      {['Web Development', 'Design', 'Business', 'Marketing'].map((category) => (
                        <Link
                          key={category}
                          to={`/category/${category.toLowerCase()}`}
                          className="block py-2 text-sm text-gray-600 hover:text-green-600"
                        >
                          {category}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Items */}
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="mobile-nav-link"
                >
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto ${item.badge.className}`}>
                      {item.badge.content}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            {renderMobileAuth()}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Helper component for nav links
const NavLink = ({ children, to, className = "" }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => `
        flex items-center px-3 py-2 rounded-lg text-sm font-medium
        ${isActive ? 'text-green-600 bg-green-50' : 'text-gray-700'} 
        hover:text-green-600 hover:bg-green-50 transition-colors duration-200 
        ${className}
      `}
    >
      {children}
    </RouterNavLink>
  );
};

export default Navbar;
