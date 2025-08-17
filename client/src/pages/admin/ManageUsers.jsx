import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import {
  Search, User, Edit, Trash, ChevronLeft, ChevronRight, Check, X,
  ExternalLink, LogOut, CheckCircle2, CircleDashed, BookOpen, MinusCircle
} from 'lucide-react';

// --- Mock Data and Functions (Simulating API calls) ---
// Mock Courses Data
const MOCK_COURSES = [
  { id: 'c1', title: 'The Complete React Developer', price: 99 },
  { id: 'c2', title: 'Advanced Tailwind CSS Techniques', price: 49 },
  { id: 'c3', title: 'Node.js & Express API Masterclass', price: 129 },
  { id: 'c4', title: 'Digital Marketing Fundamentals', price: 79 },
  { id: 'c5', title: 'Data Science with Python', price: 149 },
  { id: 'c6', title: 'UI/UX Design for Beginners', price: 59 },
  { id: 'c7', title: 'Ethical Hacking and Cybersecurity', price: 199 },
  { id: 'c8', title: 'Mobile App Development with React Native', price: 119 },
  { id: 'c9', title: 'Game Development with Unity', price: 159 },
  { id: 'c10', title: 'AWS Cloud Practitioner Certification', price: 89 },
];

// Updated Mock Users Data to include a list of purchased course IDs
const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'student', purchasedCourses: ['c1', 'c2', 'c4'], lastLogin: '2025-08-15T10:30:00Z' },
  { id: '2', name: 'Bob Smith', email: 'bob.s@example.com', role: 'instructor', purchasedCourses: ['c1', 'c3'], lastLogin: '2025-08-16T15:45:00Z' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'admin', purchasedCourses: [], lastLogin: '2025-08-14T09:00:00Z' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', role: 'student', purchasedCourses: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'], lastLogin: '2025-08-16T11:20:00Z' },
  { id: '5', name: 'Edward Norton', email: 'edward.n@example.com', role: 'student', purchasedCourses: ['c2', 'c6', 'c7'], lastLogin: '2025-08-15T18:00:00Z' },
  { id: '6', name: 'Frank Reynolds', email: 'frank.r@example.com', role: 'student', purchasedCourses: ['c8'], lastLogin: '2025-08-16T07:10:00Z' },
  { id: '7', name: 'Grace Hopper', email: 'grace.h@example.com', role: 'student', purchasedCourses: ['c1', 'c5', 'c9', 'c10'], lastLogin: '2025-08-16T12:05:00Z' },
  { id: '8', name: 'Henry Hill', email: 'henry.h@example.com', role: 'instructor', purchasedCourses: ['c3', 'c4', 'c5'], lastLogin: '2025-08-15T22:30:00Z' },
  { id: '9', name: 'Isabel Torres', email: 'isabel.t@example.com', role: 'student', purchasedCourses: ['c1', 'c2', 'c3', 'c10'], lastLogin: '2025-08-16T14:15:00Z' },
  { id: '10', name: 'Jack Bauer', email: 'jack.b@example.com', role: 'admin', purchasedCourses: [], lastLogin: '2025-08-16T16:55:00Z' },
  { id: '11', name: 'Kara Danvers', email: 'kara.d@example.com', role: 'student', purchasedCourses: ['c1', 'c6', 'c8'], lastLogin: '2025-08-16T10:00:00Z' },
  { id: '12', name: 'Lisa Cuddy', email: 'lisa.c@example.com', role: 'student', purchasedCourses: ['c2', 'c7'], lastLogin: '2025-08-15T19:40:00Z' },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Reusable Components ---

const UserActionModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, isDestructive, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl space-y-4"
      >
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600">{message}</p>
        {children}
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
              isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {confirmText}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const CoursesModal = ({ user, onClose, onRemoveCourse }) => {
  const userCourses = MOCK_COURSES.filter(course => user?.purchasedCourses.includes(course.id));

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-lg mx-auto shadow-2xl space-y-4"
      >
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Courses for {user.name}</h3>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        
        {userCourses.length > 0 ? (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {userCourses.map(course => (
              <li key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{course.title}</p>
                  <p className="text-sm text-gray-600">Price: ${course.price}</p>
                </div>
                {/* Remove button for each course */}
                <motion.button
                  onClick={() => onRemoveCourse(user, course)}
                  className="ml-4 p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove from course"
                >
                  <MinusCircle className="w-5 h-5" />
                </motion.button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3" />
            <p>This user has not purchased any courses yet.</p>
          </div>
        )}

      </motion.div>
    </div>
  );
};

// --- Main Component ---
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [courseToRemove, setCourseToRemove] = useState(null); // New state for course removal
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const roles = ['all', 'admin', 'instructor', 'student'];
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    // Simulating fetching data from an API
    const fetchUsers = async () => {
      setLoading(true);
      await sleep(1000); // Simulate network delay
      setUsers(MOCK_USERS);
      setLoading(false);
      toast.success("Users data loaded successfully!");
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term and selected role
    let newFilteredUsers = users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = selectedRole === 'all' || user.role === selectedRole;
      return nameMatch && roleMatch;
    });

    setFilteredUsers(newFilteredUsers);
    setCurrentPage(1); // Reset to first page on new filter
  }, [users, searchTerm, selectedRole]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setModalAction('edit-role');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalAction('delete');
    setIsModalOpen(true);
  };

  const handleViewCourses = (user) => {
    setSelectedUser(user);
    setModalAction('view-courses');
    setIsModalOpen(true);
  };
  
  // New handler for removing a course
  const handleRemoveCourse = (user, course) => {
    setSelectedUser(user);
    setCourseToRemove(course);
    setModalAction('remove-course');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    if (modalAction === 'edit-role') {
      await sleep(500);
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: selectedUser.role } : u
      ));
      toast.success(`${selectedUser.name}'s role updated to ${selectedUser.role}`);
    } else if (modalAction === 'delete') {
      await sleep(500);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success(`${selectedUser.name} has been deleted.`);
    } else if (modalAction === 'remove-course' && courseToRemove) {
      // Simulate API call to remove course from user
      await sleep(500);
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, purchasedCourses: u.purchasedCourses.filter(cId => cId !== courseToRemove.id) } 
          : u
      ));
      toast.success(`${courseToRemove.title} removed from ${selectedUser.name}.`);
      setCourseToRemove(null);
      // Re-open the courses modal to show the updated list
      setModalAction('view-courses');
      return; // Do not close the modal completely
    }

    setIsModalOpen(false);
    setSelectedUser(null);
    setCourseToRemove(null);
  };

  const handleCancelAction = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setCourseToRemove(null);
  };

  const getRoleBadge = (role) => {
    let colorClass = '';
    switch (role) {
      case 'admin':
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 'instructor':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'student':
      default:
        colorClass = 'bg-green-100 text-green-800';
        break;
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-800">Loading Users...</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-gray-600 mt-1">View and manage all users on the platform.</p>
            </div>
            {/* Action buttons could go here */}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by Role:</span>
              <select
                className="py-2 px-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            {currentUsers.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center flex-1 min-w-0 gap-4">
                      <div className="flex-shrink-0">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {getRoleBadge(user.role)}
                      {/* Button to view courses */}
                      <motion.button
                        onClick={() => handleViewCourses(user)}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>{user.purchasedCourses.length} Courses</span>
                      </motion.button>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => handleEditRole(user)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit Role"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete User"
                      >
                        <Trash className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p>No users found matching your search.</p>
              </div>
            )}
          </motion.div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && modalAction === 'delete' && (
          <UserActionModal
            isOpen={isModalOpen}
            onClose={handleCancelAction}
            onConfirm={handleConfirmAction}
            title="Delete User"
            message={`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
            confirmText="Delete"
            isDestructive={true}
          />
        )}
        {isModalOpen && modalAction === 'edit-role' && (
          <UserActionModal
            isOpen={isModalOpen}
            onClose={handleCancelAction}
            onConfirm={handleConfirmAction}
            title="Edit User Role"
            message={`Change the role for ${selectedUser.name}:`}
            confirmText="Update Role"
            isDestructive={false}
          >
            <div className="mt-4">
              <select
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                className="w-full p-2 border rounded-xl"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </UserActionModal>
        )}
        {isModalOpen && modalAction === 'remove-course' && courseToRemove && (
          <UserActionModal
            isOpen={isModalOpen}
            onClose={handleCancelAction}
            onConfirm={handleConfirmAction}
            title="Remove Course"
            message={`Are you sure you want to remove ${courseToRemove.title} from ${selectedUser.name}'s courses?`}
            confirmText="Remove"
            isDestructive={true}
          />
        )}
        {isModalOpen && modalAction === 'view-courses' && selectedUser && (
          <CoursesModal
            user={selectedUser}
            onClose={handleCancelAction}
            onRemoveCourse={handleRemoveCourse}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ManageUsers;
