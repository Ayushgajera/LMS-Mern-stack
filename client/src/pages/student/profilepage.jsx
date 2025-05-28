import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiBook, FiAward, FiClock, FiBarChart2,
  FiEdit, FiMail, FiLinkedin, FiGithub
} from 'react-icons/fi';
import EditProfile from './EditProfile';
import { toast } from 'sonner'
import { useLoaduserQuery} from '@/features/api/authApi';


const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    role: 'Student',
    email: 'john@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=7C3AED&color=fff',
    learningStats: {
      hoursLearned: 45,
      coursesEnrolled: 8,
      certificatesEarned: 3,
      avgScore: 92
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    }
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    try {
      // Merge the updated profile with existing stats
      setUserProfile(prev => ({
        ...prev,
        ...updatedProfile,
        learningStats: prev.learningStats // Preserve learning stats
      }));
      setIsEditing(false);
      // Show success message
     
    } catch (error) {
      console.error('Error saving profile:', error);

    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const { data, isLoading } = useLoaduserQuery();
  // console.log(data);
  if(isLoading){
    return <h1>profile is Loading</h1>
  }
 const {user}=data;
 console.log(user);
  return (
    <>
      <div className="min-h-screen bg-gray-50 mt-18">
        {/* Profile Header */}
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.photoUrl || userProfile.avatar}
                  alt={userProfile.name}
                  className="w-24 h-24 rounded-full border-4 border-purple-100"
                />
                <button className="absolute -bottom-1 -right-1 p-1.5 bg-purple-600 text-white rounded-full 
                  hover:bg-purple-700 transition-colors duration-200">
                  <FiEdit className="w-4 h-4" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.role.toUpperCase()}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <a href={`mailto:${user.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                    <FiMail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <a href={userProfile.socialLinks.linkedin}
                      className="p-2 text-gray-600 hover:text-purple-600">
                      <FiLinkedin className="w-5 h-5" />
                    </a>
                    <a href={userProfile.socialLinks.github}
                      className="p-2 text-gray-600 hover:text-purple-600">
                      <FiGithub className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium
                  hover:bg-purple-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: FiClock, label: 'Hours Learned', value: userProfile.learningStats.hoursLearned },
              { icon: FiBook, label: 'Courses Enrolled', value: userProfile.learningStats.coursesEnrolled },
              { icon: FiAward, label: 'Certificates', value: userProfile.learningStats.certificatesEarned },
              { icon: FiBarChart2, label: 'Avg. Score', value: `${userProfile.learningStats.avgScore}%` }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow duration-200"
                >
                  <Icon className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex space-x-8">
              {['courses', 'certificates', 'wishlist'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors duration-200
                    ${activeTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {activeTab === 'courses' && (
            <div className="grid gap-6">
              <div className="text-center text-gray-600">
                {user.enrolledCourses.length == 0 ? (
                   
                  <p className="text-lg font-medium">You are not enrolled in any courses yet.</p>
                ) : (
                  <p>You are enrolled in courses.</p>
                )}
              </div>
            </div>
          )}
          {/* You can add content for other tabs here */}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <EditProfile
          userProfile={userProfile}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
};

export default ProfilePage;
