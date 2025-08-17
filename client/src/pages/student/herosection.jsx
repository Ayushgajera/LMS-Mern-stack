import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiArrowDownCircle, FiUsers, FiBookOpen, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const stats = [
  { label: 'Students', value: '12,000+', icon: <FiUsers className="text-emerald-600 w-6 h-6" /> },
  { label: 'Courses', value: '120+', icon: <FiBookOpen className="text-emerald-600 w-6 h-6" /> },
  { label: 'Certificates', value: '5,000+', icon: <FiAward className="text-emerald-600 w-6 h-6" /> },
];

const testimonials = [
  {
    name: 'Alice Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'This platform transformed my career! The courses are practical and the instructors are top-notch.',
    course: 'React Mastery Bootcamp',
  },
  {
    name: 'Michael Lee',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'I loved the interactive lectures and the ability to learn at my own pace. Highly recommended!',
    course: 'Machine Learning Basics',
  },
  {
    name: 'Sara Kim',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'The certificate helped me land my dream job. Thank you for such a great learning experience!',
    course: 'UI/UX Design',
  },
];

function useTypewriter(words, speed = 120, pause = 1200) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [forward, setForward] = useState(true);
  useEffect(() => {
    if (subIndex === words[index].length + 1 && forward) {
      setTimeout(() => setForward(false), pause);
      return;
    }
    if (subIndex === 0 && !forward) {
      setForward(true);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (forward ? 1 : -1));
    }, forward ? speed : 40);
    return () => clearTimeout(timeout);
  }, [subIndex, forward, index, words, speed, pause]);
  return words[index].substring(0, subIndex);
}

const HeroSection = ({ search, setSearch, filteredCourses }) => {
  const coursesRef = useRef(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  // --- Autocomplete State ---
  const [isFocused, setIsFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  // console.log("User in HeroSection:", user.role);

  // Only use backend courses for suggestions
  const filteredCourseSuggestions = search.trim()
    ? filteredCourses.filter(c =>
        (c.courseTitle || '').toLowerCase().includes(search.trim().toLowerCase()) ||
        (c.category || '').toLowerCase().includes(search.trim().toLowerCase())
      )
    : [];
  const totalSuggestions = filteredCourseSuggestions.length;

  // Keyboard navigation for course suggestions
  const handleKeyDown = (e) => {
    if (!totalSuggestions) return;
    if (e.key === 'ArrowDown') {
      setActiveIdx(idx => (idx + 1) % totalSuggestions);
    } else if (e.key === 'ArrowUp') {
      setActiveIdx(idx => (idx - 1 + totalSuggestions) % totalSuggestions);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      // Redirect to course detail
      const course = filteredCourseSuggestions[activeIdx];
      if (course && course._id) {
        window.location.href = `/course/${course._id}`;
      }
    }
  };

  const handleCourseSuggestionClick = (course) => {
    if (course && course._id) {
      window.location.href = `/course/${course._id}`;
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100); // Delay to allow click
  };



  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [testimonialIdx]);

  // Add blinking cursor style on mount (only once)
  useEffect(() => {
    if (!document.getElementById('blinking-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'blinking-cursor-style';
      style.innerHTML = `.blinking-cursor { animation: blink 1s steps(2, start) infinite; }\n@keyframes blink { to { visibility: hidden; } }`;
      document.head.appendChild(style);
    }
  }, []);

  // Animation variants for direction-aware slide+fade+scale
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
      zIndex: 0,
      position: 'absolute',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
      position: 'relative',
      transition: { duration: 0.55, type: 'tween', ease: [0.4, 0, 0.2, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      zIndex: 0,
      position: 'absolute',
      transition: { duration: 0.5, type: 'tween', ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <div className="relative min-h-[80vh] bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50 flex flex-col overflow-x-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-100 rounded-full opacity-30 blur-3xl z-0" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-200 rounded-full opacity-20 blur-2xl z-0" />
      {/* Hero Split Layout */}
      <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col-reverse md:flex-row items-center relative z-10">
        {/* Left: Text & CTA */}
        <div className="flex-1 flex flex-col items-start md:items-start gap-6">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold leading-tight mb-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Unlock Your Potential
          </motion.h1>
          <p className="text-gray-600 text-lg max-w-xl mb-2">
            Learn from world-class instructors, join a vibrant community, and earn certificates to boost your career.
          </p>
          {/* Search Bar with Suggestions */}
          <div className="relative z-40 w-full max-w-md mb-2">
            <form
              className="flex items-center bg-white rounded-xl shadow px-4 py-2 w-full"
              onSubmit={e => { e.preventDefault(); handleScrollToCourses(); }}
              autoComplete="off"
            >
              <FiSearch className="text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for courses..."
                className="flex-1 outline-none bg-transparent text-gray-700 text-lg"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveIdx(-1); }}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              <button type="submit" className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition text-lg">
                Search
              </button>
            </form>
            {/* Suggestions Dropdown */}
            {isFocused && search.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto border border-emerald-200 min-w-[320px]">
                {filteredCourseSuggestions.length > 0 ? (
                  filteredCourseSuggestions.map((course, idx) => (
                    <div
                      key={course._id}
                      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors duration-150 ${activeIdx === idx ? 'bg-emerald-50 border-l-4 border-emerald-500 shadow-md' : 'hover:bg-emerald-50'} group`}
                      style={{ borderBottom: '1px solid #e5e7eb', borderRadius: idx === filteredCourseSuggestions.length - 1 ? '0 0 1rem 1rem' : 0 }}
                      onMouseDown={() => handleCourseSuggestionClick(course)}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      <img
                        src={course.courseThumbnail || 'https://via.placeholder.com/40x40?text=No+Image'}
                        alt={course.courseTitle || 'Course'}
                        className="w-12 h-12 object-cover rounded-lg border border-emerald-100 shadow-sm flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-emerald-800 truncate text-base leading-tight group-hover:underline">{course.courseTitle || 'Untitled Course'}</span>
                        <span className="text-xs text-gray-500 mt-1 truncate">{course.category || ''}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-center">No results found</div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-green-200/50 hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              <FiArrowDownCircle className="w-6 h-6" />
              Explore Courses
            </button>
           {user?.role !== "instructor" && (
        <button
          onClick={() => navigate("/become-instructor")}
          className="px-6 py-3 bg-white text-emerald-700 border border-emerald-600 rounded-xl font-bold shadow hover:bg-emerald-50 transition text-lg"
        >
          Become an Instructor
        </button>
      )}

          </div>
        </div>
        {/* Right: Hero Image & Floating Stats */}
        <div className="flex-1 flex flex-col items-center relative mb-10 md:mb-0">
          <div className="relative w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop"
              alt="Learning Hero"
              className="rounded-3xl shadow-2xl w-full h-80 object-cover border-4 border-white"
            />
            {/* Floating Stats Card */}
            <motion.div
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-8 py-4 flex gap-8 items-center border border-emerald-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  {stat.icon}
                  <span className="text-xl font-bold text-emerald-700 mt-1">{stat.value}</span>
                  <span className="text-gray-500 text-xs">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      {/* Testimonial Carousel */}
      <div className="container mx-auto px-4 mt-24 mb-12 relative">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center relative transition-all duration-300 min-h-[370px]">
          <div className="relative w-full min-h-[270px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={testimonialIdx}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center text-center w-full absolute left-0 top-0"
                style={{ minHeight: 250 }}
              >
                <img
                  src={testimonials[testimonialIdx].avatar}
                  alt={testimonials[testimonialIdx].name}
                  className="w-24 h-24 rounded-full object-cover mb-5 border-4 border-emerald-300 shadow-lg transition-all duration-300"
                />
                <p className="text-gray-700 italic mb-5 text-lg md:text-xl max-w-xl transition-all duration-300 font-medium">"{testimonials[testimonialIdx].text}"</p>
                <span className="font-bold text-emerald-700 text-lg">{testimonials[testimonialIdx].name}</span>
                <span className="text-xs text-gray-500 mb-2">{testimonials[testimonialIdx].course}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Dot Indicators */}
          <div className="flex gap-2 mt-6 mb-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > testimonialIdx ? 1 : -1);
                  setTestimonialIdx(idx);
                }}
                className={`w-3 h-3 rounded-full border-2 ${testimonialIdx === idx ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-emerald-300'} transition-all`}
                aria-label={`Go to testimonial ${idx + 1}`}
                style={{ outline: 'none' }}
              />
            ))}
          </div>
          <div className="flex gap-6 mt-2">
            <button
              onClick={() => {
                setDirection(-1);
                setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length);
              }}
              className="p-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 shadow transition-all focus:ring-2 focus:ring-emerald-300"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                setDirection(1);
                setTestimonialIdx((testimonialIdx + 1) % testimonials.length);
              }}
              className="p-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 shadow transition-all focus:ring-2 focus:ring-emerald-300"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Courses Section Anchor */}
      <div ref={coursesRef} id="courses-section" />
      {/* No Courses rendering here; handled in homepage */}
    </div>
  );
};

export default HeroSection;

