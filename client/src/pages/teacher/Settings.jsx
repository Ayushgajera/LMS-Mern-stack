import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiBell, FiLock, FiCreditCard,
  FiGlobe, FiSave, FiX 
} from 'react-icons/fi';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Enhanced Mobile Tab Selector */}
      <div className="lg:hidden mb-6">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full appearance-none bg-white border rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="profile" className="py-2">Profile Settings</option>
            <option value="notifications" className="py-2">Notifications</option>
            <option value="security" className="py-2">Security</option>
            <option value="billing" className="py-2">Billing</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Enhanced Desktop Navigation */}
        <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
          <nav className="space-y-1.5 sm:space-y-2 sticky top-4 bg-white rounded-xl p-2 shadow-sm">
            <SettingsTab
              icon={<FiUser />}
              label="Profile Settings"
              isActive={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
            <SettingsTab
              icon={<FiBell />}
              label="Notifications"
              isActive={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
            <SettingsTab
              icon={<FiLock />}
              label="Security"
              isActive={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
            <SettingsTab
              icon={<FiCreditCard />}
              label="Billing"
              isActive={activeTab === 'billing'}
              onClick={() => setActiveTab('billing')}
            />
          </nav>
        </div>

        {/* Enhanced Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
              {activeTab === 'profile' && <ProfileSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'billing' && <BillingSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ icon, label, isActive, onClick }) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      w-full flex items-center gap-3
      px-3 sm:px-4 py-2.5 sm:py-3
      rounded-lg
      transition-all duration-200
      touch-manipulation
      ${isActive 
        ? 'bg-blue-50 text-blue-600 shadow-sm' 
        : 'text-gray-700 hover:bg-gray-50'
      }
    `}
  >
    {React.cloneElement(icon, {
      className: `w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${
        isActive ? 'text-blue-600' : 'text-gray-500'
      }`
    })}
    <span className={`
      font-medium text-sm sm:text-base
      transition-colors duration-200
      ${isActive ? 'text-blue-600' : 'text-gray-700'}
    `}>
      {label}
    </span>
  </motion.button>
);

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Experienced instructor specializing in web development.',
    website: 'www.johndoe.com',
    twitter: '@johndoe',
    linkedin: 'linkedin.com/in/johndoe'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add save logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Profile Settings</h2>
      
      {/* Profile Photo Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <img
          src="https://ui-avatars.com/api/?name=John+Doe"
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div className="text-center sm:text-left">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Change Photo
          </button>
          <p className="text-sm text-gray-500 mt-2">
            JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
        <button
          type="button"
          className="w-full sm:w-auto px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    courseComments: true,
    studentEnrollments: true,
    newReviews: true,
    promotions: false
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Notification Preferences</h2>
      
      <div className="space-y-4">
        <NotificationToggle
          label="Email Updates"
          description="Receive updates about your courses via email"
          checked={notifications.emailUpdates}
          onChange={(checked) => setNotifications({...notifications, emailUpdates: checked})}
        />
        <NotificationToggle
          label="Course Comments"
          description="Get notified when students comment on your courses"
          checked={notifications.courseComments}
          onChange={(checked) => setNotifications({...notifications, courseComments: checked})}
        />
        <NotificationToggle
          label="Student Enrollments"
          description="Receive notifications for new student enrollments"
          checked={notifications.studentEnrollments}
          onChange={(checked) => setNotifications({...notifications, studentEnrollments: checked})}
        />
        <NotificationToggle
          label="New Reviews"
          description="Get notified when you receive new course reviews"
          checked={notifications.newReviews}
          onChange={(checked) => setNotifications({...notifications, newReviews: checked})}
        />
        <NotificationToggle
          label="Promotions"
          description="Receive promotional emails and special offers"
          checked={notifications.promotions}
          onChange={(checked) => setNotifications({...notifications, promotions: checked})}
        />
      </div>
    </div>
  );
};

const NotificationToggle = ({ label, description, checked, onChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b gap-3">
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-medium text-gray-900 mb-1">{label}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
    </div>
    <div className="flex items-center">
      <button
        type="button"
        className={`
          relative inline-flex h-6 w-11 
          items-center rounded-full 
          transition-colors duration-200 
          ease-in-out focus:outline-none 
          focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        `}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`
            inline-block h-4 w-4 
            transform rounded-full 
            bg-white transition-transform 
            duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  </div>
);

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password change logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>
      
      <div className="grid grid-cols-1 gap-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Update Password
        </button>
      </div>
    </form>
  );
};

const BillingSettings = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Billing Settings</h2>
      
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
            className="h-4 w-4 text-blue-600"
          />
          <span>Credit Card</span>
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
            className="h-4 w-4 text-blue-600"
          />
          <span>PayPal</span>
        </label>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="**** **** **** ****"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              placeholder="***"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div>
        <button
          type="button"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Payment Method
        </button>
      </div>
    </div>
  );
};

export default Settings;