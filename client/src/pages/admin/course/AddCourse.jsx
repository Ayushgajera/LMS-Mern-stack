import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiGrid, FiPlus, FiX } from 'react-icons/fi';
import { useCreateCourseMutation } from '@/features/api/courseApi';
import { useNavigate } from 'react-router-dom';

function AddCourse() {
  const [formData, setFormData] = useState({
    courseTitle: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
 const navigate=useNavigate();
  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Design',
    'Business',
    'Marketing'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const [createCourse,{data,isLoading}]=useCreateCourseMutation();
  const handleCreateCourse = async () => {
    try {
      const response = await createCourse(formData).unwrap();
      navigate("/admin/courses");
      console.log("Course created successfully:", response);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = 'courseTitle is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the details below to create a new course.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Course courseTitle *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiBook className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 
                  focus:border-transparent transition-colors duration-200
                  ${errors.courseTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter course courseTitle"
              />
            </div>
            {errors.courseTitle && (
              <p className="text-sm text-red-500 mt-1">{errors.courseTitle}</p>
            )}
          </div>
          {/* Category Select */}
        
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiGrid className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`block w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 
                  focus:border-transparent transition-colors duration-200 appearance-none
                  ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button onClick={handleCreateCourse}
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
                transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FiPlus className="h-5 w-5" />
              <span>Create Course</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddCourse;
