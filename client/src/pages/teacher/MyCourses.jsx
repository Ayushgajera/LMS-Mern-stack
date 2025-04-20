import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit2, FiTrash2, FiEye, FiPlay, FiUsers, 
  FiDollarSign, FiStar, FiFilter 
} from 'react-icons/fi';

const MyCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Mastery",
      thumbnail: "https://placehold.co/600x400",
      status: "published",
      students: 234,
      revenue: 4500,
      rating: 4.8,
      lastUpdated: "2024-04-15",
      progress: 100,
    },
    {
      id: 2,
      title: "Node.js Advanced",
      thumbnail: "https://placehold.co/600x400",
      status: "draft",
      students: 0,
      revenue: 0,
      rating: 0,
      lastUpdated: "2024-04-18",
      progress: 60,
    },
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-gray-600">Manage and track your courses</p>
        </div>
        <div className="flex space-x-4">
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">All Courses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Course
          </motion.button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const CourseCard = ({ course }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-xl shadow-sm overflow-hidden"
  >
    <div className="relative">
      <img 
        src={course.thumbnail} 
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-2 right-2">
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${course.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'}
        `}>
          {course.status}
        </span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <FiUsers className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">{course.students} students</span>
        </div>
        <div className="flex items-center">
          <FiDollarSign className="text-gray-400 mr-2" />
          <span className="text-sm text-gray-600">${course.revenue}</span>
        </div>
        <div className="flex items-center">
          <FiStar className="text-yellow-400 mr-2" />
          <span className="text-sm text-gray-600">{course.rating}</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">
            Updated {new Date(course.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>

      {course.status === 'draft' && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${course.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {course.progress}% complete
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FiEdit2 className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <FiEye className="text-gray-600" />
          </button>
        </div>
        <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <FiPlay className="mr-2" />
          {course.status === 'published' ? 'View Course' : 'Continue Editing'}
        </button>
      </div>
    </div>
  </motion.div>
);

export default MyCourses;