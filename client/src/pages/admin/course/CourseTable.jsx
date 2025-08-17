import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiBook, FiAlertCircle, FiUsers, FiDollarSign, FiEye, FiTrendingUp, FiCalendar, FiClock, FiStar, FiTag, FiGlobe, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useGetAllCoursesQuery, useRemoveCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

function CourseTable() {
  const { data, isLoading, error, refetch } = useGetAllCoursesQuery();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [removeCourse, { data: removeCourseData, isLoading: removeCourseLoading }] = useRemoveCourseMutation();

  useEffect(() => {
    refetch();
  }, []);

  const handleRemoveCourse = async () => {
    try {
      await removeCourse(selectedCourseId).unwrap();
      toast.success('Course deleted successfully!');
      refetch();
      setShowDeletePopup(false);
    } catch (error) {
      toast.error('Failed to delete course. Please try again.');
    }
  };

  // Loading state with better UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-xl w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl">
                    <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry option
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg"
          >
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Failed to load courses</h3>
            <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred'}</p>
            <motion.button
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Helper functions
  const formatPrice = (price) => {
    return price ? `$${Number(price)}` : 'Free';
  };

  const getEnrolledStudentsCount = (course) => {
    return course.enrolledStudents?.length || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Empty state
  if (!data?.courses || data.courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="sm:flex sm:items-center sm:justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                Your Courses
              </h2>
              <p className="text-gray-600 text-lg">
                Get started by creating your first course
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/admin/courses/create"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Create New Course
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg"
          >
            <FiBook className="mx-auto h-20 w-20 text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No courses yet</h3>
            <p className="text-gray-500 text-lg mb-6">Create your first course to get started.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Start Creating
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main content with courses
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="sm:flex sm:items-center sm:justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
              Your Courses
            </h2>
            <p className="text-gray-600 text-lg">
              Manage and monitor your course catalog
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/admin/courses/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="mr-2 h-5 w-5" />
              Create New Course
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: 'Total Courses', value: data.courses.length, icon: <FiBook className="w-8 h-8  text-blue-600  z-50" />, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
            { label: 'Published', value: data.courses.filter(c => c.ispublished).length, icon: <FiEye className=" text-emerald-600 w-6 h-6" />, color: 'from-emerald-500 to-emerald-600', bgColor: 'from-emerald-50 to-emerald-100' },
            { label: 'Total Students', value: data.courses.reduce((sum, c) => sum + getEnrolledStudentsCount(c), 0), icon: <FiUsers className="w-6 h-6  text-purple-600" />, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
            { label: 'Total Revenue', value: `$${data.courses.reduce((sum, c) => sum + (c.coursePrice * getEnrolledStudentsCount(c)), 0)}`, icon: <FiDollarSign className="w-6 h-6  text-amber-600" />, color: 'from-amber-500 to-amber-600', bgColor: 'from-amber-50 to-amber-100' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
                  <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Courses List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {data.courses.map((course, index) => (
            <motion.div
              key={course._id}
              className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Course Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Course Thumbnail */}
                    <div className="h-20 w-20 flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.courseTitle}
                          className="h-20 w-20 rounded-xl object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-sm">
                          <FiBook className="h-10 w-10 text-emerald-600" />
                        </div>
                      )}
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{course.courseTitle}</h3>
                          <p className="text-gray-600 mb-3">{course.subTitle}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
                            ${course.ispublished 
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' 
                              : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                            }`}>
                            {course.ispublished ? <FiCheckCircle className="h-3 w-3 mr-1" /> : <FiXCircle className="h-3 w-3 mr-1" />}
                            {course.ispublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Course Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Category */}
                        <div className="flex items-center space-x-2">
                          <FiTag className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="text-sm font-medium text-gray-900">{course.category}</p>
                          </div>
                        </div>

                        {/* Students */}
                        <div className="flex items-center space-x-2">
                          <FiUsers className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Students</p>
                            <p className="text-sm font-medium text-gray-900">{getEnrolledStudentsCount(course)}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <FiDollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-sm font-medium text-gray-900">{formatPrice(course.coursePrice)}</p>
                          </div>
                        </div>

                        {/* Level */}
                        <div className="flex items-center space-x-2">
                          <FiTrendingUp className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Level</p>
                            <p className="text-sm font-medium text-gray-900">{course.courseLevel || 'Not Set'}</p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <FiStar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Rating</p>
                            <p className="text-sm font-medium text-gray-900">{course.rating || '0'}/5</p>
                          </div>
                        </div>

                        {/* Created Date */}
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(course.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                    <Link
                      to={`/admin/courses/edit/${course._id}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 
                        rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <FiEdit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setShowDeletePopup(true);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 
                        rounded-lg hover:from-red-100 hover:to-red-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                      <FiTrash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeletePopup && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Course</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to delete this course? This action cannot be undone.</p>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setShowDeletePopup(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleRemoveCourse}
                      disabled={removeCourseLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {removeCourseLoading ? 'Deleting...' : 'Delete'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CourseTable;
