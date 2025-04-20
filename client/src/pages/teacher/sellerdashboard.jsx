import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBook, FiDollarSign, FiUsers, FiTrendingUp, FiPlusCircle,
  FiGrid, FiBarChart2, FiSettings, FiHelpCircle, FiMenu,
  FiBell, FiMessageSquare, FiX
} from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import MyCourses from './MyCourses';
import Analytics from './Analytics';
import Students from './Students';
import Messages from './Messages';
import Settings from './Settings';
import Help from './Help';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend
);

const SellerDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const courseData = {
    published: 12,
    draft: 3,
    totalStudents: 1234,
    totalRevenue: 45678,
    recentSales: [
      { id: 1, course: "React Mastery", amount: 99, date: "2024-04-20" },
      { id: 2, course: "Node.js Advanced", amount: 129, date: "2024-04-19" },
      // Add more sales data
    ]
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'students':
        return <Students />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'courses':
        return <MyCourses />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="p-4 lg:p-6 2xl:p-8">
            {/* Stats cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              <StatsCard 
                title="Total Courses"
                value={courseData.published + courseData.draft}
                subtitle={`${courseData.published} published`}
                icon={<FiBook />}
                color="blue"
              />
              <StatsCard 
                title="Total Students"
                value={courseData.totalStudents}
                subtitle="Across all courses"
                icon={<FiUsers />}
                color="green"
              />
              <StatsCard 
                title="Total Revenue"
                value={`$${courseData.totalRevenue.toLocaleString()}`}
                subtitle="Lifetime earnings"
                icon={<FiDollarSign />}
                color="purple"
              />
              <StatsCard 
                title="Growth Rate"
                value="23%"
                subtitle="vs last month"
                icon={<FiTrendingUp />}
                color="rose"
              />
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 my-8">
              <RevenueChart />
              <StudentChart />
            </div>

            {/* Recent sales section */}
            <div className="bg-white rounded-xl shadow-sm p-6 2xl:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl 2xl:text-2xl font-semibold text-gray-800">
                  Recent Sales
                </h3>
                <select 
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <RecentSalesTable sales={courseData.recentSales} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar - Updated with fixed width transitions */}
        <motion.aside 
          className={`
            fixed inset-y-0 left-0
            bg-white border-r shadow-sm
            z-40
            transition-all duration-300 ease-in-out
            lg:relative lg:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${isSidebarOpen 
              ? 'w-[280px] sm:w-[300px] lg:w-[250px] 2xl:w-[280px]' 
              : 'w-0 lg:w-[70px]'
            }
          `}
        >
          {/* Updated Sidebar Header */}
          <div className="h-16 px-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
            {(isSidebarOpen || isMobileMenuOpen) && (
              <h1 className="text-base sm:text-lg xl:text-xl font-bold text-gray-800 truncate">
                Instructor Portal
              </h1>
            )}
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 hidden lg:block flex-shrink-0"
            >
              <FiMenu className="w-5 h-5 xl:w-6 xl:h-6 text-gray-600" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Updated Sidebar Content */}
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <nav className="p-3 space-y-1">
              <SidebarLink 
                icon={<FiGrid className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="Dashboard"
                isActive={activeTab === 'dashboard'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
              />
              <SidebarLink 
                icon={<FiBook className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="My Courses"
                isActive={activeTab === 'courses'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('courses');
                  setIsMobileMenuOpen(false);
                }}
              />
              <SidebarLink 
                icon={<FiBarChart2 className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="Analytics"
                isActive={activeTab === 'analytics'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('analytics');
                  setIsMobileMenuOpen(false);
                }}
              />
              <SidebarLink 
                icon={<FiUsers className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="Students"
                isActive={activeTab === 'students'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('students');
                  setIsMobileMenuOpen(false);
                }}
              />
              <SidebarLink 
                icon={<FiMessageSquare className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="Messages"
                isActive={activeTab === 'messages'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('messages');
                  setIsMobileMenuOpen(false);
                }}
              />
              <SidebarLink 
                icon={<FiSettings className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="Settings"
                isActive={activeTab === 'settings'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileMenuOpen(false);
                }}
              />
              <SidebarLink 
                icon={<FiHelpCircle className="w-5 h-5 xl:w-6 xl:h-6" />} 
                label="Help"
                isActive={activeTab === 'help'}
                isSidebarOpen={isSidebarOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={() => {
                  setActiveTab('help');
                  setIsMobileMenuOpen(false);
                }}
              />
            </nav>
          </div>
        </motion.aside>

        {/* Mobile Overlay - Updated */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area - Updated with proper transitions */}
        <div className={`
          flex-1
          min-w-0
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
        `}>
          {/* Top Navigation - Updated */}
          <nav className="sticky top-0 z-20 bg-white border-b shadow-sm">
            <div className="h-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-[1920px]">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center">
                  <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
                  >
                    <FiMenu className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 rounded-full hover:bg-gray-100 relative">
                    <FiBell className="w-6 h-6 text-gray-600" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                    <img 
                      src="https://ui-avatars.com/api/?name=John+Doe" 
                      alt="Seller"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-gray-700">John Doe</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content - Updated with responsive padding */}
          <main className={`
            p-4 sm:p-6 lg:p-8
            transition-all duration-300 ease-in-out
          `}>
            <div className="mx-auto max-w-[1920px] space-y-6 sm:space-y-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SidebarLink = ({ icon, label, isActive, isSidebarOpen, isMobileMenuOpen, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`
      w-full flex items-center
      ${isSidebarOpen ? 'px-4' : 'px-2 justify-center'} 
      py-3 sm:py-3.5
      rounded-lg
      transition-all duration-200
      touch-manipulation
      ${isActive 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-700 hover:bg-gray-50'
      }
    `}
    whileHover={{ x: isSidebarOpen ? 4 : 0 }}
    whileTap={{ scale: 0.98 }}
  >
    {React.cloneElement(icon, {
      className: `w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
        isActive ? 'text-blue-600' : 'text-gray-500'
      }`
    })}
    {(isSidebarOpen || isMobileMenuOpen) && (
      <span className="ml-3 font-medium text-sm truncate">
        {label}
      </span>
    )}
    {!isSidebarOpen && !isMobileMenuOpen && (
      <span className="sr-only">{label}</span>
    )}
  </motion.button>
);

const StatsCard = ({ title, value, subtitle, icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-xl shadow-sm p-6 2xl:p-8"
  >
    <div className={`
      w-12 h-12 2xl:w-14 2xl:h-14 
      rounded-xl bg-${color}-50 
      flex items-center justify-center mb-4
    `}>
      {React.cloneElement(icon, { 
        className: `w-6 h-6 2xl:w-7 2xl:h-7 text-${color}-500` 
      })}
    </div>
    <h3 className="text-2xl 2xl:text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm 2xl:text-base font-medium text-gray-500">{title}</p>
    <p className="text-xs 2xl:text-sm text-gray-400 mt-1">{subtitle}</p>
  </motion.div>
);

const RevenueChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [3000, 4500, 3800, 5200, 4800, 6000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Revenue Overview
      </h3>
      <div className="h-[300px] sm:h-[350px]">
        <Line 
          data={data} 
          options={{ 
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                align: 'end',
              }
            }
          }} 
        />
      </div>
    </div>
  );
};

const StudentChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Students',
      data: [45, 62, 58, 75, 68, 84],
      backgroundColor: 'rgb(16, 185, 129)',
    }]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Student Enrollment
      </h3>
      <div className="h-[300px] sm:h-[350px]">
        <Bar 
          data={data} 
          options={{ 
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                align: 'end',
              }
            }
          }} 
        />
      </div>
    </div>
  );
};

const RecentSalesTable = ({ sales }) => (
  <div className="overflow-x-auto -mx-4 lg:mx-0">
    <div className="inline-block min-w-full align-middle">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">
              Course
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">
              Amount
            </th>
            <th className="px-4 lg:px-6 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm lg:text-base text-gray-900">
                {sale.course}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm lg:text-base text-gray-900">
                ${sale.amount}
              </td>
              <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm lg:text-base text-gray-500">
                {new Date(sale.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SellerDashboard;
