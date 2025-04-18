import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBookOpen, FiBarChart2, FiDollarSign, FiTrendingUp, FiCalendar, 
         FiMail, FiPhone, FiMapPin, FiEdit2, FiSettings, FiBell, FiShield, 
         FiCheck, FiClock, FiAward, FiEdit3, FiSave, FiX } from 'react-icons/fi';
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
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "John Admin",
    email: "admin@edulearn.com",
    phone: "+1 (555) 123-4567",
    role: "Super Admin",
    joinDate: "2023-01-01",
    department: "Management",
    location: "New York, USA",
    bio: "Experienced administrator with expertise in educational technology and learning management systems.",
    avatar: "https://ui-avatars.com/api/?name=John+Admin&background=0062cc&color=fff"
  });

  const [editFormData, setEditFormData] = useState(adminData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditing(false);
    setEditFormData(adminData);
    setError(null);
  }, [adminData]);

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!editFormData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!editFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
        throw new Error('Valid email is required');
      }
      if (!editFormData.phone.trim()) {
        throw new Error('Phone number is required');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      setAdminData(editFormData);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [editFormData]);

  const AdminProfileSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <FiEdit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleEditSubmit}
              className="flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleCloseEdit}
              className="flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </motion.button>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
        <div className="md:w-1/3">
          <div className="relative">
            <img
              src={adminData.avatar}
              alt={adminData.name}
              className="w-40 h-40 rounded-2xl object-cover shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2">
              <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                <FiShield className="w-4 h-4" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
            </span>
          </div>
          <div className="mt-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{adminData.name}</h2>
            <div className="flex items-center justify-center md:justify-start mt-2 space-x-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {adminData.role}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>
        </div>

        <div className="md:w-2/3 mt-8 md:mt-0">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Email" value={adminData.email} icon={<FiMail />} />
              <InfoItem label="Phone" value={adminData.phone} icon={<FiPhone />} />
              <InfoItem label="Department" value={adminData.department} icon={<FiBookOpen />} />
              <InfoItem label="Location" value={adminData.location} icon={<FiMapPin />} />
              <InfoItem label="Join Date" value={adminData.joinDate} icon={<FiCalendar />} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <p className="text-gray-600">{adminData.bio}</p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4"
              >
                <form onSubmit={handleEditSubmit} className="p-6">
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditField
                      label="Full Name"
                      value={editFormData.name}
                      field="name"
                      icon={<FiUsers />}
                      error={error?.name}
                      placeholder="Enter your full name"
                    />
                    <EditField
                      label="Email Address"
                      value={editFormData.email}
                      field="email"
                      type="email"
                      icon={<FiMail />}
                      error={error?.email}
                      placeholder="Enter your email"
                    />
                    <EditField
                      label="Phone"
                      value={editFormData.phone}
                      field="phone"
                      icon={<FiPhone />}
                      error={error?.phone}
                      placeholder="Enter your phone number"
                    />
                    <EditField
                      label="Department"
                      value={editFormData.department}
                      field="department"
                      icon={<FiBookOpen />}
                      error={error?.department}
                      placeholder="Enter your department"
                    />
                    <EditField
                      label="Location"
                      value={editFormData.location}
                      field="location"
                      icon={<FiMapPin />}
                      error={error?.location}
                      placeholder="Enter your location"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={editFormData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows="3"
                        className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleCloseEdit}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                EduLearn Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-full hover:bg-gray-100">
                <FiBell className="w-6 h-6 text-gray-600" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} className="p-2 rounded-full hover:bg-gray-100">
                <FiSettings className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminProfileSection />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Students"
            value="1,234"
            icon={<FiUsers />}
            change="+12%"
            className="bg-blue-50"
          />
          <StatsCard 
            title="Active Courses"
            value="45"
            icon={<FiBookOpen />}
            change="+5%"
            className="bg-green-50"
          />
          <StatsCard 
            title="Revenue"
            value="$45,678"
            icon={<FiDollarSign />}
            change="+8%"
            className="bg-purple-50"
          />
          <StatsCard 
            title="Growth"
            value="23%"
            icon={<FiTrendingUp />}
            change="+2%"
            className="bg-rose-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-[300px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
            <div className="h-[300px]">
              <Doughnut data={courseData} options={{...chartOptions, scales: undefined}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, change, className }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`${className} rounded-2xl p-6 shadow-md transition-shadow hover:shadow-lg`}
  >
    <div className="flex justify-between items-start">
      <div className="p-2 rounded-lg bg-white shadow-sm">
        {React.cloneElement(icon, { className: "w-6 h-6 text-blue-600" })}
      </div>
      <span className="text-sm font-medium text-green-600">{change}</span>
    </div>
    <h3 className="mt-4 text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-sm text-gray-600">{title}</p>
  </motion.div>
);

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [30000, 35000, 45000, 40000, 50000, 55000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
    },
  ],
};

const courseData = {
  labels: ['Active', 'Completed', 'Upcoming', 'Draft'],
  datasets: [
    {
      data: [45, 25, 20, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(156, 163, 175, 0.8)',
      ],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
};

const InfoItem = ({ label, value, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center text-gray-600">
      {icon && <span className="mr-2">{icon}</span>}
      {value}
    </div>
  </div>
);

const EditField = memo(({ label, value, field, type = "text", icon, error, placeholder }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(icon, { 
            className: `h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}` 
          })}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className={`
          block w-full rounded-lg border-2 
          ${error ? 'border-red-300' : 'border-gray-200'}
          ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
          text-gray-900 placeholder-gray-500
          transition-colors duration-200
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
          hover:border-gray-300
        `}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
));

export default AdminDashboard;