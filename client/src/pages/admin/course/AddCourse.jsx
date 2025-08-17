import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiBook, FiGrid, FiPlus, FiX, FiLoader,FiChevronDown ,FiCheck } from "react-icons/fi";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";
import { Listbox } from "@headlessui/react";

// ✅ Constants for category options
const COURSE_CATEGORIES = [
  "Web Development", "Mobile Development", "Design", "Marketing", "Data Science",
  "Business", "AI & Machine Learning", "Cybersecurity", "Cloud Computing", "DevOps",
  "Game Development", "Digital Marketing", "UI/UX Design"
];

// ✅ Reusable Input Component
const FormInput = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        {...props}
        className={`block w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500
          focus:border-transparent transition-colors duration-200
          ${error ? "border-red-300 bg-red-50" : "border-gray-300"}`}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

// ✅ Reusable Select Component
const FormSelect = ({ label, icon: Icon, options, error, value, onChange }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <Listbox value={value} onChange={(val) => onChange({ target: { name: "category", value: val } })}>
        <Listbox.Button
          className={`block w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 
          focus:border-transparent transition-colors duration-200 text-left
          ${error ? "border-red-300 bg-red-50" : "border-gray-300"}`}
        >
          {value || "Select a category"}
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FiChevronDown className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white border border-gray-200 shadow-lg z-10">
          {options.map((opt) => (
            <Listbox.Option
              key={opt}
              value={opt}
              className={({ active }) =>
                `cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? "bg-emerald-100" : "text-gray-900"
                }`
              }
            >
              {({ selected }) => (
                <>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiCheck className="h-5 w-5 text-emerald-600" />
                    </span>
                  )}
                  {opt}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

function AddCourse() {
  const [formData, setFormData] = useState({ courseTitle: "", category: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseTitle.trim()) newErrors.courseTitle = "Course title is required";
    if (!formData.category) newErrors.category = "Please select a category";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;

    try {
      await createCourse(formData).unwrap();
      navigate("/admin/courses");
    } catch (error) {
      setApiError(error?.data?.message || "Failed to create course. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in the details below to create a new course.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {apiError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-start p-4 text-sm text-red-800 rounded-xl bg-red-50"
            >
              <FiX className="flex-shrink-0 w-5 h-5 mr-3 mt-0.5 cursor-pointer" onClick={() => setApiError(null)} />
              <div className="font-medium">{apiError}</div>
            </motion.div>
          )}

          <FormInput
            label="Course Title"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="Enter course title"
            icon={FiBook}
            error={errors.courseTitle}
          />

          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={COURSE_CATEGORIES}
            icon={FiGrid}
            error={errors.category}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit" disabled={isLoading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl flex items-center justify-center space-x-2
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                transition-colors duration-200
                ${isLoading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="h-5 w-5" />
                  <span>Create Course</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddCourse;
