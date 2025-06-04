import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiBook } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useGetAllCoursesQuery } from '@/features/api/courseApi';


function CourseTable() {
  const { data, isLoading ,refetch} = useGetAllCoursesQuery();
  if(isLoading) return <div>Loading...</div>;
  console.log("Courses data:", data.courses[0]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <FiBook className="h-5 w-5 text-emerald-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.courseTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.enrolledStudents == 0 ? "0" : enrolledStudents.length} students
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {course.ispublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.price ? `${$}course.price.toFixed(2) `: 'N/A'}
                  </td>

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
                      <button className="text-red-400 hover:text-red-500">
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {data.courses.length === 0 && (
          <div className="text-center py-12">
            <FiBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
            <div className="mt-6">
              <Link
                to="/admin/courses"
                className="inline-flex items-center px-4 py-2 border border-transparent 
                  rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 
                  hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-emerald-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Create New Course
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default CourseTable;
