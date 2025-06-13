import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiBook, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useGetAllCoursesQuery } from '@/features/api/courseApi';
import { toast } from 'sonner';

function CourseTable() {
  const { data, isLoading, error, refetch } = useGetAllCoursesQuery();
  console.log(data);
  

  // Loading state with better UI
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-100 rounded-2xl mt-8"></div>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry option
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white border border-red-100 rounded-2xl shadow-sm"
        >
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-base font-medium text-gray-900">Failed to load courses</h3>
          <p className="mt-1 text-sm text-gray-500">{error.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent 
              rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </motion.div>
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

  // Empty state
  if (!data?.courses || data.courses.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first course
            </p>
          </div>
          <Link
            to="/admin/courses/create"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent 
              rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            Create New Course
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white border border-gray-200 rounded-2xl shadow-sm"
        >
          <FiBook className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first course to get started.</p>
        </motion.div>
      </div>
    );
  }

  // Main content with courses
  return (
    <div className="p-4 sm:p-6 lg:p-8  mt-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your course catalog
          </p>
        </div>
        <Link
          to="/admin/courses/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent 
            rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Create New Course
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.courses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Course title cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.courseTitle}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <FiBook className="h-5 w-5 text-emerald-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.courseTitle}</div>
                        <div className="text-sm text-gray-500">{course.subTitle}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {course.category}
                    </span>
                  </td>

                  {/* Students count cell */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getEnrolledStudentsCount(course)} students
                  </td>

                  {/* Status cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  {/* Price cell */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatPrice(course.coursePrice)}
                  </td>

                  {/* Actions cell */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/admin/courses/edit/${course._id}`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 
                          rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <FiEdit2 className="h-4 w-4 mr-1" />
                        <span>Edit</span>
                      </Link>
                      <button 
                        
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 
                          rounded-lg hover:bg-red-100 transition-colors duration-200"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default CourseTable;
