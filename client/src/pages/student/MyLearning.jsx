import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiBarChart, FiPlayCircle, FiList, FiGrid } from 'react-icons/fi';

function MyLearning() {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
      progress: 45,
      lastAccessed: '2024-03-20',
      totalHours: 52,
      completedHours: 23.4,
      category: 'Development'
    },
    // Add more courses as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['all', 'in-progress', 'not-started', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    ${activeFilter === filter 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {filter.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {courses.map(course => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Course Thumbnail */}
              <div className="relative aspect-video">
                <img 
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <button className="p-3 bg-white rounded-full text-purple-600 hover:bg-purple-50 transition-colors duration-200">
                    <FiPlayCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {course.instructor}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{course.progress}% complete</span>
                    <span>{course.completedHours}/{course.totalHours} hrs</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                  </span>
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg 
                    hover:bg-purple-700 transition-colors duration-200">
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyLearning;
