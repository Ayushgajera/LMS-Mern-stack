import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiBarChart, FiBook, FiUsers, FiTarget } from 'react-icons/fi';
import { toast } from 'sonner';

// --- Mock Data (Simulating API calls) ---
const MOCK_REVENUE_DATA = [
  { courseId: 'c1', courseTitle: 'The Complete React Developer', price: 99, enrollments: 350 },
  { courseId: 'c2', courseTitle: 'Advanced Tailwind CSS Techniques', price: 49, enrollments: 120 },
  { courseId: 'c3', courseTitle: 'Node.js & Express API Masterclass', price: 129, enrollments: 210 },
  { courseId: 'c4', courseTitle: 'Digital Marketing Fundamentals', price: 79, enrollments: 450 },
  { courseId: 'c5', courseTitle: 'Data Science with Python', price: 149, enrollments: 180 },
  { courseId: 'c6', courseTitle: 'UI/UX Design for Beginners', price: 59, enrollments: 280 },
  { courseId: 'c7', courseTitle: 'Ethical Hacking and Cybersecurity', price: 199, enrollments: 95 },
  { courseId: 'c8', courseTitle: 'Mobile App Development with React Native', price: 119, enrollments: 160 },
  { courseId: 'c9', courseTitle: 'Game Development with Unity', price: 159, enrollments: 75 },
  { courseId: 'c10', courseTitle: 'AWS Cloud Practitioner Certification', price: 89, enrollments: 310 },
];

const MOCK_MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 15000, enrollments: 200 },
  { month: 'Feb', revenue: 18500, enrollments: 220 },
  { month: 'Mar', revenue: 22000, enrollments: 280 },
  { month: 'Apr', revenue: 20500, enrollments: 250 },
  { month: 'May', revenue: 25000, enrollments: 300 },
  { month: 'Jun', revenue: 28000, enrollments: 340 },
  { month: 'Jul', revenue: 26500, enrollments: 320 },
  { month: 'Aug', revenue: 31000, enrollments: 380 },
  { month: 'Sep', revenue: 33500, enrollments: 410 },
  { month: 'Oct', revenue: 35000, enrollments: 430 },
  { month: 'Nov', revenue: 38000, enrollments: 460 },
  { month: 'Dec', revenue: 41000, enrollments: 500 },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// --- Main Component ---
export default function Revenue() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyEnrollments: 0,
    avgRevenuePerCourse: 0,
    mostProfitableCourse: 'N/A',
  });
  const [coursesData, setCoursesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(6);

  useEffect(() => {
    const calculateStats = async () => {
      setIsLoading(true);
      await sleep(1000); // Simulate network delay

      const coursesWithRevenue = MOCK_REVENUE_DATA.map(course => ({
        ...course,
        totalCourseRevenue: course.price * course.enrollments,
      }));
      setCoursesData(coursesWithRevenue);

      const totalRevenue = coursesWithRevenue.reduce((sum, course) => sum + course.totalCourseRevenue, 0);
      const avgRevenuePerCourse = totalRevenue / coursesWithRevenue.length;
      
      const mostProfitableCourse = coursesWithRevenue.reduce((max, course) =>
        course.totalCourseRevenue > max.totalCourseRevenue ? course : max,
        { totalCourseRevenue: -1 }
      );
      
      const monthlyRevenue = MOCK_MONTHLY_REVENUE[MOCK_MONTHLY_REVENUE.length - 1]?.revenue || 0;
      const monthlyEnrollments = MOCK_MONTHLY_REVENUE[MOCK_MONTHLY_REVENUE.length - 1]?.enrollments || 0;

      setStats({
        totalRevenue,
        monthlyRevenue,
        monthlyEnrollments,
        avgRevenuePerCourse,
        mostProfitableCourse: mostProfitableCourse.courseTitle,
      });

      setIsLoading(false);
    };

    calculateStats();
  }, []);

  const dashboardCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
    },
    {
      label: 'This Month\'s Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <FiBarChart className="w-6 h-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Monthly Enrollments',
      value: formatNumber(stats.monthlyEnrollments),
      icon: <FiUsers className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'Most Profitable Course',
      value: stats.mostProfitableCourse,
      icon: <FiBook className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-600',
    }
  ];

  const filteredMonthlyData = MOCK_MONTHLY_REVENUE.slice(-timeframe);
  const maxMonthlyRevenue = Math.max(...filteredMonthlyData.map(d => d.revenue));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-800">Calculating revenue...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Revenue Overview</h1>
            <p className="text-gray-600 mt-1">Key financial metrics and course performance.</p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <span className="text-sm font-medium text-gray-600">Timeframe:</span>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="px-3 py-2 border rounded-xl bg-white text-gray-700 text-sm"
            >
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.bgColor} shadow-sm group-hover:shadow-md transition-all duration-300`}>
                    <div className={card.textColor}>{card.icon}</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Growth Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white">
                  <FiTrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Growth</h3>
              </div>
              <p className="text-2xl font-bold text-emerald-600 mt-2">+5.5%</p>
              <p className="text-sm text-gray-500">vs. last month</p>
            </div>
          </motion.div>

          {/* Avg. Enrollment Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white">
                  <FiUsers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Avg. Enrollments</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{formatNumber(stats.monthlyEnrollments / MOCK_MONTHLY_REVENUE.length)}</p>
              <p className="text-sm text-gray-500">per course (monthly)</p>
            </div>
          </motion.div>

          {/* Avg. Course Price Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Avg. Course Price</h3>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-2">{formatCurrency(stats.avgRevenuePerCourse)}</p>
              <p className="text-sm text-gray-500">across all courses</p>
            </div>
          </motion.div>
        </div>

        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <FiBarChart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Monthly Revenue Trend</h2>
          </div>
          <div className="w-full h-80 relative p-4">
            {/* Chart Grid Lines */}
            <div className="absolute inset-0 grid grid-rows-5 -z-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 last:border-b-0"></div>
              ))}
            </div>
            <div className="flex justify-between items-end h-full gap-2">
              {filteredMonthlyData.map((data, index) => (
                <motion.div
                  key={data.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / maxMonthlyRevenue) * 100}%` }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="w-12 sm:w-16 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-lg relative group"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-center text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {formatCurrency(data.revenue)}
                  </div>
                  <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">
                    {data.month}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Revenue Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg overflow-x-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <FiTarget className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Revenue Breakdown by Course</h2>
          </div>
          <table className="min-w-full table-auto text-left">
            <thead className="text-sm text-gray-600 uppercase">
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-4 py-3 font-medium">Course Title</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Price</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Enrollments</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 divide-y divide-gray-200">
              {coursesData.map(course => (
                <motion.tr
                  key={course.courseId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <td className="px-4 py-4">{course.courseTitle}</td>
                  <td className="px-4 py-4 text-right">${course.price}</td>
                  <td className="px-4 py-4 text-right">{formatNumber(course.enrollments)}</td>
                  <td className="px-4 py-4 text-right font-semibold text-emerald-600">{formatCurrency(course.totalCourseRevenue)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}
