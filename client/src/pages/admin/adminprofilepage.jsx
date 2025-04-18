import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp, FiSearch, 
  FiFilter, FiDownload, FiEdit2, FiTrash2, FiMoreVertical, 
  FiMail, FiPhone, FiMapPin, FiCalendar 
} from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend
);

const adminprofilepage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Student",
      status: "Active",
      joinedDate: "2024-01-15",
      coursesEnrolled: 5,
      lastActive: "2024-04-18",
      avatar: "https://ui-avatars.com/api/?name=John+Doe"
    },
    // Add more user data as needed
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Users"
            value="1,234"
            change="+12%"
            icon={<FiUsers />}
            color="blue"
          />
          <StatsCard 
            title="Active Courses"
            value="45"
            change="+5%"
            icon={<FiBookOpen />}
            color="green"
          />
          <StatsCard 
            title="Revenue"
            value="$45,678"
            change="+8%"
            icon={<FiDollarSign />}
            color="purple"
          />
          <StatsCard 
            title="Growth"
            value="23%"
            change="+2%"
            icon={<FiTrendingUp />}
            color="pink"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <FilterControls 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <UsersTable users={users} />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
        </div>
      </div>
    </div>
  );
};

// Component Definitions
const StatsCard = ({ title, value, change, icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-500`}
  >
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-500`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-green-600">{change}</span>
    </div>
    <h3 className="mt-4 text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-sm text-gray-600">{title}</p>
  </motion.div>
);

const SearchBar = ({ value, onChange }) => (
  <div className="relative flex-1">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Search users..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const FilterControls = ({ selectedFilter, onFilterChange }) => (
  <div className="flex items-center space-x-4">
    <select
      value={selectedFilter}
      onChange={(e) => onFilterChange(e.target.value)}
      className="rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="all">All Users</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <button className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
      <FiDownload className="mr-2" /> Export
    </button>
  </div>
);

const UsersTable = ({ users }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {["User", "Role", "Status", "Joined", "Courses", "Actions"].map((header) => (
          <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </tbody>
  </table>
);

const UserRow = ({ user }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
        {user.role}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        user.status === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {user.status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(user.joinedDate).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {user.coursesEnrolled}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex items-center space-x-3">
        <button className="text-blue-600 hover:text-blue-900">
          <FiEdit2 />
        </button>
        <button className="text-red-600 hover:text-red-900">
          <FiTrash2 />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical />
        </button>
      </div>
    </td>
  </tr>
);

export default adminprofilepage;