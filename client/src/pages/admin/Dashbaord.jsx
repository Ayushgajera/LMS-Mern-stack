import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

function Dashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    { label: 'Total Students', value: '1,234', icon: <FiUsers />, change: '+12%' },
    { label: 'Active Courses', value: '48', icon: <FiBookOpen />, change: '+5%' },
    { label: 'Total Revenue', value: '$12,345', icon: <FiDollarSign />, change: '+18%' },
    { label: 'Course Views', value: '24.5K', icon: <FiTrendingUp />, change: '+25%' }
  ];

  return (
    <div className="space-y-6 mt-10 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <motion.div 
          className="inline-flex items-center space-x-2 text-sm bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiBarChart2 className="w-4 h-4" />
          <span>Revenue up 24% from last month</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                {React.cloneElement(stat.icon, { className: 'w-6 h-6' })}
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <select className="text-sm border rounded-lg px-2 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Chart Component Here
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Courses</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    Complete Web Development Course
                  </h4>
                  <p className="text-sm text-gray-500">248 students enrolled</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">$99</span>
                  <p className="text-xs text-emerald-600">+12 this week</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
