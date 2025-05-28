import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUsers, FiBookOpen } from 'react-icons/fi';
import Courses from './Courses';
import Course from './Course';

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
    },
    {
      id: 2,
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

    },
    {
      id: 3,
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 p-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Expand Your Knowledge
          </h1>
          <p className="text-gray-600 text-lg mb-6">
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

        
       
          <Courses  />
  



      </div>
    </div>
  );
};

export default HeroSection;