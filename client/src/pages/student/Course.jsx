import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiBook, FiStar, FiBookmark } from 'react-icons/fi';

function Course({ course }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
        transform hover:-translate-y-1"
    >
      {/* Course Image Section */}
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 
          rounded-t-xl" 
        />
        <button 
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white 
            transition-colors duration-200"
          aria-label="Bookmark course"
        >
          <FiBookmark className="w-4 h-4 text-gray-600" />
        </button>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="px-2 py-1 bg-white/90 rounded-lg text-sm font-medium">
            {course.level}
          </span>
          <span className="px-2 py-1 bg-green-500/90 text-white rounded-lg text-sm font-medium">
            ${course.price}
          </span>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="p-5 space-y-4">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 
            transition-colors duration-200">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FiClock className="w-4 h-4 text-gray-400" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiBook className="w-4 h-4 text-gray-400" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>

        {/* Instructor and Rating */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{course.instructor.name}</p>
              <p className="text-xs text-gray-500">{course.instructor.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating}</span>
            <span className="text-xs text-gray-500">({course.students})</span>
          </div>
        </div>

        {/* Call to Action */}
        <button 
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
            hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Enroll Now
        </button>
      </div>
    </motion.div>
  );
}

Course.defaultProps = {
  course: {
    title: 'Course Title',
    description: 'Course description goes here',
    level: 'Beginner',
    price: '49.99',
    duration: '10 weeks',
    lessons: 12,
    instructor: {
      name: 'John Doe',
      role: 'Instructor',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe'
    },
    rating: 4.5,
    students: 1234,
    image: 'https://via.placeholder.com/400x300'
  }
};

export default Course;
