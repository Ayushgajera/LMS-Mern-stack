import React, { useState, useMemo } from 'react';
import HeroSection from './student/herosection';
import { FiBookOpen, FiUsers, FiAward, FiStar, FiCheckCircle, FiPlayCircle, FiMail, FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import Courses from './student/Courses';
import { useGetPublishCourseQuery } from '@/features/api/courseApi';

const categories = [
  { name: 'Web Development', icon: <FiBookOpen className="text-emerald-600" /> },
  { name: 'Data Science', icon: <FiAward className="text-emerald-600" /> },
  { name: 'Design', icon: <FiStar className="text-emerald-600" /> },
  { name: 'Business', icon: <FiUsers className="text-emerald-600" /> },
  { name: 'AI & ML', icon: <FiPlayCircle className="text-emerald-600" /> },
];
// Centralized courses array for search/filter

// const allCourses = [
//   {
//     id: 1,
//     title: 'React Mastery Bootcamp',
//     instructor: 'Jane Doe',
//     image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&auto=format&fit=crop',
//     rating: 4.9,
//     students: 1200,
//     price: 49.99,
//     description: 'Master React and build real-world projects.',
//   },
//   {
//     id: 2,
//     title: 'Python for Data Science',
//     instructor: 'John Smith',
//     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop',
//     rating: 4.8,
//     students: 980,
//     price: 39.99,
//     description: 'Learn Python and data science fundamentals.',
//   },
//   {
//     id: 3,
//     title: 'UI/UX Design Fundamentals',
//     instructor: 'Emily Clark',
//     image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&auto=format&fit=crop',
//     rating: 4.7,
//     students: 850,
//     price: 29.99,
//     description: 'Design beautiful and user-friendly interfaces.',
//   },
//   // Add more courses as needed
// ];
 



const instructors = [
  {
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: 'Senior React Instructor',
  },
  {
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Data Science Lead',
  },
  {
    name: 'Emily Clark',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    title: 'UI/UX Designer',
  },
];

const faqs = [
  {
    q: 'How do I enroll in a course?',
    a: 'Simply click on the course you are interested in and follow the enrollment instructions.'
  },
  {
    q: 'Do I get a certificate after completion?',
    a: 'Yes, you will receive a certificate for every course you complete.'
  },
  {
    q: 'Can I access courses on mobile?',
    a: 'Absolutely! Our platform is fully responsive and works on all devices.'
  },
  {
    q: 'Are there any free courses?',
    a: 'Yes, we offer a selection of free courses. Look for the "Free" label.'
  },
];

const blogPosts = [
  {
    title: '5 Tips to Succeed in Online Learning',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop',
    excerpt: 'Discover how to stay motivated and make the most of your online courses.',
    link: '#',
  },
  {
    title: 'Top 10 Programming Languages in 2024',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=400&auto=format&fit=crop',
    excerpt: 'Stay ahead in tech by learning the most in-demand languages this year.',
    link: '#',
  },
];

const partners = [
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
];

const features = [
  {
    icon: <FiCheckCircle className="w-8 h-8 text-emerald-600" />, title: 'Expert Instructors',
    desc: 'Learn from industry leaders and experienced educators.'
  },
  {
    icon: <FiPlayCircle className="w-8 h-8 text-emerald-600" />, title: 'Flexible Learning',
    desc: 'Access courses anytime, anywhere, on any device.'
  },
  {
    icon: <FiAward className="w-8 h-8 text-emerald-600" />, title: 'Certification',
    desc: 'Earn certificates to showcase your skills and boost your career.'
  },
  {
    icon: <FiUsers className="w-8 h-8 text-emerald-600" />, title: 'Community Support',
    desc: 'Join a vibrant community of learners and mentors.'
  },
];

function Homepage() {
  // All hooks at the top
  const [search, setSearch] = useState('');
  const { data, isSuccess, isLoading, isError } = useGetPublishCourseQuery();
  // Defensive: support backend shape { courses: array, ... }
  const allCourses = Array.isArray(data?.courses)
    ? data.courses
    : [];
  const featuredCourses = allCourses;
  const [openFaq, setOpenFaq] = useState(null);

  // Filter courses based on search
  const filteredCourses = useMemo(() => {
    if (!search.trim()) return allCourses;
    const term = search.trim().toLowerCase();
    return allCourses.filter(course =>
      (course.courseTitle || '').toLowerCase().includes(term) ||
      (course.category || '').toLowerCase().includes(term)
    );
  }, [search, allCourses]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load courses. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection
        search={search}
        setSearch={setSearch}
        filteredCourses={filteredCourses}
      />

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat, idx) => (
              <div key={cat.name} className="flex flex-col items-center bg-emerald-50 rounded-xl p-6 w-40 shadow hover:shadow-lg transition">
                {cat.icon}
                <span className="mt-3 text-lg font-semibold text-emerald-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtered Courses Section */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">Courses</h2>
          {filteredCourses.length > 0 ? (
            <Courses courses={filteredCourses} />
          ) : (
            <div className="text-center text-gray-500 py-12 text-lg">No courses found matching your search.</div>
          )}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">Trending Courses</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col items-center hover:scale-105 transition-transform">
                  <img src={course.courseThumbnail || 'https://via.placeholder.com/320x160?text=No+Image'} alt={course.courseTitle || 'Course'} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-bold text-emerald-700 mb-1">{course.courseTitle || 'Untitled Course'}</h3>
                  <span className="text-gray-500 text-sm mb-2">Category: {course.category || 'Unknown'}</span>
                  <div className="flex items-center gap-2 mb-2">
                    <FiStar className="text-yellow-400" />
                    <span className="font-semibold text-gray-700">{course.rating || '4.5'}</span>
                    <span className="text-xs text-gray-400">({Array.isArray(course.enrolledStudents) ? course.enrolledStudents.length : 0} students)</span>
                  </div>
                  <div className="text-emerald-600 font-bold text-lg mb-2">${course.coursePrice || '0.00'}</div>
                  <a href={`/course/${course._id}`} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">View Course</a>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-12 text-lg w-full">No featured courses available at the moment.</div>
            )}
          </div>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">Meet Our Top Instructors</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {instructors.map((inst) => (
              <div key={inst.name} className="flex flex-col items-center bg-emerald-50 rounded-xl p-6 w-64 shadow hover:shadow-lg transition">
                <img src={inst.avatar} alt={inst.name} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-emerald-200" />
                <span className="font-bold text-emerald-700 text-lg">{inst.name}</span>
                <span className="text-gray-500 text-sm">{inst.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">Why Learn With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {features.map((f, idx) => (
              <div key={f.title} className="flex flex-col items-center bg-white rounded-xl p-6 shadow hover:shadow-xl transition">
                {f.icon}
                <h3 className="mt-4 text-lg font-bold text-emerald-700">{f.title}</h3>
                <p className="mt-2 text-gray-600 text-center">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      

      {/* Blog/News Highlights */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">From Our Blog</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {blogPosts.map((post) => (
              <div key={post.title} className="bg-emerald-50 rounded-xl shadow p-6 w-80 flex flex-col items-center hover:shadow-lg transition">
                <img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded mb-3" />
                <h3 className="font-bold text-emerald-700 text-lg mb-1">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                <a href={post.link} className="text-emerald-600 font-semibold hover:underline">Read More</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners/Brands */}
      <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-center mb-6 text-emerald-700">Trusted by Leading Companies</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((logo, idx) => (
              <img key={idx} src={logo} alt="Partner Logo" className="h-10 object-contain grayscale hover:grayscale-0 transition" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-emerald-700">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.q} className="border rounded-xl p-4 bg-emerald-50">
                <button
                  className="w-full flex justify-between items-center text-lg font-semibold text-emerald-700 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  {faq.q}
                  <span>{openFaq === idx ? '-' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-gray-700 text-base">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gradient-to-r from-emerald-500 to-green-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated!</h2>
          <p className="text-lg text-emerald-100 mb-6">Subscribe to our newsletter for the latest courses and offers.</p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
            <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-lg w-full sm:w-auto flex-1 focus:outline-none" required />
            <button type="submit" className="px-6 py-3 bg-white text-emerald-700 font-bold rounded-lg shadow hover:bg-emerald-50 transition">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Extended Footer */}
      <footer className="py-10 bg-white border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-bold text-emerald-700">EduLearn</span>
            <span className="text-gray-500 text-sm">Empowering Learners Everywhere.</span>
            <div className="flex gap-3 mt-2">
              <a href="#" className="text-gray-400 hover:text-emerald-600"><FiTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><FiFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><FiInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-emerald-600"><FiLinkedin /></a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="text-gray-600 hover:text-emerald-700">About</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700">Contact</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-emerald-700">Terms of Service</a>
          </div>
          <form className="flex flex-col gap-2 items-center">
            <label htmlFor="footer-newsletter" className="text-gray-600 font-semibold">Newsletter</label>
            <div className="flex gap-2">
              <input id="footer-newsletter" type="email" placeholder="Your email" className="px-3 py-2 rounded-lg border focus:outline-none" />
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">Join</button>
            </div>
          </form>
        </div>
        <div className="text-center text-gray-400 text-xs mt-6">&copy; {new Date().getFullYear()} EduLearn LMS. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default Homepage;
