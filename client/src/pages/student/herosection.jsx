import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiBookOpen } from 'react-icons/fi';

const HeroSection = () => {
  const courses = [
    {
      id: 1,
      title: 'Advanced Web Development',
      description: 'Master modern web technologies and frameworks with hands-on projects.',
      instructor: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Senior Developer'
      },
      level: 'Intermediate',
      duration: '12 weeks',
      lessons: 24,
      rating: 4.8,
      students: 1234,
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 1,
      title: 'Advanced Web Development',
      description: 'Master modern web technologies and frameworks with hands-on projects.',
      instructor: {
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Senior Developer'
      },
      level: 'Intermediate',
      duration: '12 weeks',
      lessons: 24,
      rating: 4.8,
      students: 1234,
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Machine Learning Basics',
      description: 'Learn the fundamentals of machine learning and build your first models.',
      instructor: {
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        role: 'Data Scientist'
      },
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 16,
      rating: 4.9,
      students: 856,
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2940&auto=format&fit=crop',
      tags: ['Python', 'AI', 'Data']
    },
    // Add more courses as needed
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50">
      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Expand Your Knowledge
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Choose from our wide range of courses and start your learning journey today
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-medium 
              shadow-lg shadow-green-100 hover:shadow-xl hover:shadow-green-200/50 
              hover:-translate-y-0.5 transition-all duration-200">
              Explore Courses
            </button>
          </div>
        </motion.div>

        {/* Course Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Course Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600 
                  shadow-lg backdrop-blur-sm border border-green-100">
                  ${course.price}
                </div>

                {/* Level Badge */}
                <div className="absolute top-4 left-4 bg-green-500/90 px-3 py-1 rounded-full text-xs font-medium text-white 
                  backdrop-blur-sm">
                  {course.level}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {course.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full border-2 border-green-100"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">{course.instructor.name}</p>
                    <p className="text-xs text-gray-500">{course.instructor.role}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-center">
                    <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiBookOpen className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FiUsers className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating and CTA */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-600">{course.rating}</span>
                  </div>
                  
                  <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium 
                    transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                    active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Enroll Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;