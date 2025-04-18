import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiBook, FiClock, FiAward, FiActivity, FiCalendar, FiBookmark } from 'react-icons/fi';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample user data - replace with actual data from your backend
  const user = {
    name: 'Alex Johnson',
    role: 'Student',
    email: 'alex.johnson@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    joinDate: 'January 2024',
    bio: 'Passionate learner | Web Development enthusiast | Always eager to learn new technologies',
    completedCourses: 12,
    ongoingCourses: 3,
    certificates: 8,
    totalHours: 156,
    progress: 85,
    interests: ['Web Development', 'Machine Learning', 'UI/UX Design'],
    achievements: [
      { id: 1, title: 'Fast Learner', description: 'Completed 5 courses in one month' },
      { id: 2, title: 'Super Engaged', description: '100% attendance in all courses' },
    ],
    enrolledCourses: [
      {
        id: 1,
        title: 'Advanced React Development',
        progress: 75,
        lastAccessed: '2 days ago',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop'
      },
      // Add more courses as needed
    ]
  };

  const tabVariants = {
    active: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
      scale: 1.05
    },
    inactive: {
      backgroundColor: 'transparent',
      color: '#4b5563',
      scale: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-green-100"
              />
              <button className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full text-white 
                hover:bg-green-600 transition-colors duration-200">
                <FiEdit2 size={16} />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-600">{user.role}</p>
                  <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium 
                  hover:bg-green-700 transition-colors duration-200">
                  Edit Profile
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FiBook className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.completedCourses}</div>
              <div className="text-sm text-gray-600">Completed Courses</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FiClock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.totalHours}h</div>
              <div className="text-sm text-gray-600">Learning Hours</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FiAward className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.certificates}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <FiActivity className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{user.progress}%</div>
              <div className="text-sm text-gray-600">Avg. Progress</div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex space-x-4 mb-6 overflow-x-auto">
            {['overview', 'courses', 'achievements', 'certificates'].map((tab) => (
              <motion.button
                key={tab}
                variants={tabVariants}
                animate={activeTab === tab ? 'active' : 'inactive'}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap
                  transition-all duration-200`}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About Me</h3>
                  <p className="text-gray-600">{user.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
                  <div className="space-y-4">
                    {user.enrolledCourses.map(course => (
                      <div key={course.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{course.title}</h4>
                          <p className="text-sm text-gray-500">Last accessed {course.lastAccessed}</p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 rounded-full h-2"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Add more tab contents as needed */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;