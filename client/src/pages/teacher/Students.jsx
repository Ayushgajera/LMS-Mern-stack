import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, FiMessageSquare, FiMoreVertical, FiSearch,
  FiFilter, FiDownload, FiUserCheck, FiUserX 
} from 'react-icons/fi';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [students] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      courses: ['React Mastery', 'Node.js Advanced'],
      enrolled: '2024-01-15',
      progress: 75,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson'
    },
    // Add more student data
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-sm text-gray-600">Manage and track your students</p>
        </div>
        
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Students</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiDownload className="sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentRow = ({ student }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <img 
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" 
          src={student.avatar} 
          alt="" 
        />
        <div className="ml-3 sm:ml-4">
          <div className="text-sm font-medium text-gray-900">{student.name}</div>
          <div className="text-xs sm:text-sm text-gray-500">{student.email}</div>
        </div>
      </div>
    </td>
    <td className="hidden sm:table-cell px-6 py-4">
      <div className="flex flex-wrap gap-1">
        {student.courses.map((course, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {course}
          </span>
        ))}
      </div>
    </td>
    <td className="hidden md:table-cell px-6 py-4">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${student.progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 mt-1">{student.progress}%</span>
    </td>
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        student.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {student.status}
      </span>
    </td>
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
      <div className="flex items-center space-x-3">
        <button className="p-1 text-blue-600 hover:text-blue-900">
          <FiMail className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <FiMoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </td>
  </tr>
);

export default Students;