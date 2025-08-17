import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Listbox } from "@headlessui/react";
import {
    FiSave, FiX, FiDollarSign, FiBook, FiGrid, FiImage, FiUpload, FiTarget, FiInfo,
    FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList,
    FiCheck, FiUploadCloud, FiZap, FiEye, FiEyeOff, FiTrendingUp, FiUsers, FiClock,
    FiStar, FiTag, FiCalendar, FiArrowLeft, FiSettings, FiActivity, FiChevronDown
} from 'react-icons/fi';
import {
    useEditCourseMutation,
    useGetCourseByIdQuery,
    usePublishCourseMutation,
} from '@/features/api/courseApi';
import RichTextEditor from '@/extensions/RichTextEditor';
import axios from 'axios';

// A component for a stylized form select dropdown
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

function EditCourse() {
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        courseTitle: '',
        subTitle: '',
        courseDescription: '',
        category: '',
        courseLevel: 'Beginner',
        coursePrice: '',
        courseThumbnail: null,
        isPublished: false
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    const [isSubtitleLoading, setIsSubtitleLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [autoSave, setAutoSave] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // API calls
    const { data: courseData, isLoading: isCourseLoading, error, refetch } = useGetCourseByIdQuery(courseId);
    const [editCourse, { isLoading: isEditing }] = useEditCourseMutation(courseId);
    const [publishCourse, { isLoading: isPublishLoading }] = usePublishCourseMutation();
    
    const course = courseData?.course;
    console.log('Course Data:', course?.ispublished);

    const publishStatusHandler = async (action) => {
        try {
            await publishCourse({ courseId, query: action }).unwrap();
            refetch();
            toast.success("Course status updated successfully!");
        } catch (error) {
            const backendMsg = error?.data?.message;
            if (
                backendMsg === "A course must have at least 2 lectures before publishing." ||
                backendMsg === "Each lecture must have a video before publishing the course."
            ) {
                toast.error(backendMsg);
            } else {
                toast.error("Failed to update course status. Please try again.");
            }
            console.error("Edit Course Error:", error);
        }
    };

    // This is the fix. The useEffect now runs whenever the `course` object from the API changes.
    // This correctly updates your local formData state.
    useEffect(() => {
        if (course) {
            setFormData({
                courseTitle: course.courseTitle || '',
                subTitle: course.subTitle || '',
                courseDescription: course.courseDescription || '',
                category: course.category || '',
                courseLevel: course.courseLevel || 'Beginner',
                coursePrice: course.coursePrice || '',
                courseThumbnail: null, // Clear file input
                // This is the bug fix: `isPublished` is now correctly pulled from the server data.
                isPublished: course.isPublished, 
            });
            if (course.courseThumbnail) {
                setPreviewUrl(course.courseThumbnail);
            }
        }
    }, [course]);

    const courseLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const categories = [
        'Web Development', 'Mobile Development', 'Design', 'Marketing', 'Data Science',
        'Business', 'AI & Machine Learning', 'Cybersecurity', 'Cloud Computing',
        'DevOps', 'Game Development', 'Digital Marketing', 'UI/UX Design'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, courseThumbnail: file }));
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { courseTitle, subTitle, courseDescription, category, courseLevel, coursePrice, courseThumbnail, isPublished } = formData;

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('courseTitle', courseTitle);
        formDataToSubmit.append('subTitle', subTitle);
        formDataToSubmit.append('courseDescription', courseDescription);
        formDataToSubmit.append('category', category);
        formDataToSubmit.append('courseLevel', courseLevel);
        formDataToSubmit.append('coursePrice', coursePrice);
        if (courseThumbnail) {
            formDataToSubmit.append('courseThumbnail', courseThumbnail);
        }
        formDataToSubmit.append('isPublished', isPublished);

        try {
            await editCourse({ formData: formDataToSubmit, courseId }).unwrap();
            toast.success("Course updated successfully!");
            navigate('/admin/courses');
        } catch (error) {
            toast.error("Failed to update course. Please try again.");
            console.error("Edit Course Error:", error);
        }
    };

    const handleGenerateDescription = async () => {
        if (!formData.courseTitle) {
            toast.error("Please enter a course title before generating a description.");
            return;
        }
        setIsDescriptionLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/v1/ai/description", {
                courseTitle: formData.courseTitle,
            });
            const description = response.data?.description;
            if (description) {
                setFormData(prev => ({ ...prev, courseDescription: description }));
                toast.success("📝 Description generated successfully!");
            } else {
                toast.error("Description generation failed. Please try again.");
            }
        } catch (error) {
            console.error("Generate Description Error:", error);
            toast.error("❌ Failed to generate description. Check API or try again.");
        }
        setIsDescriptionLoading(false);
    };

    const handleGenerateSubtitle = async () => {
        if (!formData.courseTitle) {
            toast.error("Please enter a course title before generating a subtitle.");
            return;
        }
        setIsSubtitleLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/v1/ai/subtitle", {
                courseTitle: formData.courseTitle,
            });
            const subtitle = response.data?.subtitle;
            if (subtitle) {
                setFormData(prev => ({ ...prev, subTitle: subtitle }));
                toast.success("✨ Subtitle generated successfully!");
            } else {
                toast.error("Subtitle generation failed. Please try again.");
            }
        } catch (error) {
            console.error("Generate Subtitle Error:", error);
            toast.error("❌ Failed to generate subtitle. Check API or try again.");
        }
        setIsSubtitleLoading(false);
    };

    const calculateCompletion = () => {
        const fields = ['courseTitle', 'subTitle', 'courseDescription', 'category', 'courseLevel', 'coursePrice'];
        const completed = fields.filter(field => formData[field] && formData[field].toString().trim() !== '').length;
        return Math.round((completed / fields.length) * 100);
    };
    const completionPercentage = calculateCompletion();

    const handleAutoSave = async () => {
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('courseTitle', formData.courseTitle);
            formDataToSubmit.append('subTitle', formData.subTitle);
            formDataToSubmit.append('courseDescription', formData.courseDescription);
            formDataToSubmit.append('category', formData.category);
            formDataToSubmit.append('courseLevel', formData.courseLevel);
            formDataToSubmit.append('coursePrice', formData.coursePrice);
            formDataToSubmit.append('isPublished', formData.isPublished);

            await editCourse({ formData: formDataToSubmit, courseId }).unwrap();
            setLastSaved(new Date());
            toast.success("Auto-saved successfully!");
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
    };

    useEffect(() => {
        if (autoSave && formData.courseTitle) {
            const timer = setTimeout(() => {
                handleAutoSave();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [formData, autoSave]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        handleSubmit(e);
                        break;
                    case 'p':
                        e.preventDefault();
                        setShowPreview(!showPreview);
                        break;
                    default:
                        break;
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [showPreview]);

    if (isCourseLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Loading course...
                    </h3>
                    <p className="text-gray-600">Please wait while we fetch your course data</p>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Updating course...
                    </h3>
                    <p className="text-gray-600">Please wait while we save your changes</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <button
                                        onClick={() => navigate('/admin/courses')}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <FiArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                                        Edit Course
                                    </h1>
                                </div>
                                <p className="text-gray-600 text-sm sm:text-lg">
                                    Update your course details and manage content
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3">
                                {/* Auto-save toggle */}
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={autoSave}
                                            onChange={(e) => setAutoSave(e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        Auto-save
                                    </label>
                                    {lastSaved && (
                                        <span className="text-xs text-gray-500">
                                            Last saved: {lastSaved.toLocaleTimeString()}
                                        </span>
                                    )}
                                </div>

                                <motion.button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {showPreview ? <FiEyeOff className="w-4 h-4 sm:mr-2" /> : <FiEye className="w-4 h-4 sm:mr-2" />}
                                    <span className="hidden sm:inline">
                                        {showPreview ? 'Hide Preview' : 'Preview'}
                                    </span>
                                </motion.button>

                                <motion.button
                                    onClick={() => publishStatusHandler(course?.ispublished ? "false" : "true")}
                                    className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-200 font-medium shadow-lg text-sm"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isPublishLoading}
                                >
                                    <FiUploadCloud className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                        {isPublishLoading ? "Updating..." : course?.ispublished ? "Unpublish" : "Publish"}
                                    </span>
                                </motion.button>

                                <Link
                                    to={`/admin/courses/edit/${courseId}/lectures`}
                                    className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-medium shadow-lg text-sm"
                                >
                                    <FiBook className="w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                        Manage Content
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Course Completion</span>
                                <span className="text-sm font-semibold text-emerald-600">{completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="xl:col-span-2">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-200/50 overflow-x-auto">
                                    {[
                                        { id: 'details', label: 'Course Details', icon: <FiInfo className="w-4 h-4" /> },
                                        { id: 'pricing', label: 'Pricing & Settings', icon: <FiDollarSign className="w-4 h-4" /> },
                                        { id: 'media', label: 'Media & Assets', icon: <FiImage className="w-4 h-4" /> }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center flex-shrink-0 gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                            }`}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                                    <AnimatePresence mode="wait">
                                        {activeTab === 'details' && (
                                            <motion.div
                                                key="details"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                {/* Course Title */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Course Title *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="courseTitle"
                                                        value={formData.courseTitle}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                                        placeholder="Enter a compelling course title"
                                                        required
                                                    />
                                                </div>

                                                {/* Subtitle with AI Generation */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="block text-sm font-semibold text-gray-700">
                                                            Subtitle
                                                        </label>
                                                        <motion.button
                                                            type="button"
                                                            onClick={handleGenerateSubtitle}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-semibold rounded-lg shadow hover:from-emerald-500 hover:to-green-600 transition-all duration-200"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            disabled={isSubtitleLoading}
                                                            title="Generate subtitle using AI"
                                                        >
                                                            {isSubtitleLoading ? (
                                                                <>
                                                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                                    Generating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiZap className="w-3 h-3" />
                                                                    AI Generate
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="subTitle"
                                                        value={formData.subTitle}
                                                        onChange={handleChange}
                                                        className="block w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                                        placeholder="Add a subtitle to provide more context"
                                                    />
                                                </div>

                                                {/* Category and Level */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <FormSelect
                                                            label="Category"
                                                            name="category"
                                                            value={formData.category}
                                                            onChange={handleChange}
                                                            options={categories}
                                                            icon={FiGrid}
                                                            error={errors.category}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-semibold text-gray-700">
                                                            Course Level *
                                                        </label>
                                                        <select
                                                            name="courseLevel"
                                                            value={formData.courseLevel}
                                                            onChange={handleChange}
                                                            className="block w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                                            required
                                                        >
                                                            {courseLevels.map(level => (
                                                                <option key={level} value={level}>{level}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Description with AI Generation */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="block text-sm font-semibold text-gray-700">
                                                            Course Description
                                                        </label>
                                                        <motion.button
                                                            type="button"
                                                            onClick={handleGenerateDescription}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-semibold rounded-lg shadow hover:from-emerald-500 hover:to-green-600 transition-all duration-200"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            disabled={isDescriptionLoading}
                                                        >
                                                            {isDescriptionLoading ? (
                                                                <>
                                                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                                    Generating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FiZap className="w-3 h-3" />
                                                                    AI Generate
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                    <RichTextEditor
                                                        content={formData.courseDescription || ''}
                                                        onChange={(content) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                courseDescription: content
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'pricing' && (
                                            <motion.div
                                                key="pricing"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                {/* Price */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Course Price
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <FiDollarSign className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            name="coursePrice"
                                                            value={formData.coursePrice}
                                                            onChange={handleChange}
                                                            className="block w-full pl-12 pr-4 py-3 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/50"
                                                            placeholder="Enter price"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Publication Status */}
                                                <div className="flex items-center space-x-3 p-4 bg-gray-50/50 rounded-xl">
                                                    <input
                                                        type="checkbox"
                                                        name="isPublished"
                                                        id="isPublished"
                                                        checked={formData.isPublished}
                                                        onChange={handleChange}
                                                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200"
                                                    />
                                                    <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                                                        Make this course public
                                                    </label>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'media' && (
                                            <motion.div
                                                key="media"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-6"
                                            >
                                                {/* Thumbnail Upload */}
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700">
                                                        Course Thumbnail
                                                    </label>
                                                    <div className="mt-2">
                                                        {previewUrl ? (
                                                            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="Course thumbnail preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setPreviewUrl('');
                                                                        setFormData(prev => ({ ...prev, courseThumbnail: null }));
                                                                    }}
                                                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-lg"
                                                                >
                                                                    <FiX className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label className="w-full cursor-pointer">
                                                                <div className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-gray-50">
                                                                    <FiImage className="w-16 h-16 text-gray-400 mb-4" />
                                                                    <div className="text-center">
                                                                        <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium">
                                                                            <FiUpload className="w-4 h-4 mr-2" />
                                                                            Upload Thumbnail
                                                                        </span>
                                                                        <p className="mt-2 text-xs text-gray-500">
                                                                            PNG, JPG, GIF up to 10MB
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200/50">
                                        <motion.button
                                            type="button"
                                            onClick={() => navigate('/admin/courses')}
                                            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            onClick={handleSubmit}
                                            disabled={isEditing}
                                            type="submit"
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <FiSave className="w-4 h-4 mr-2" />
                                            {isEditing ? 'Saving...' : 'Save Changes'}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Preview Sidebar */}
                        <div className="xl:col-span-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Preview</h3>

                                {showPreview ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        {/* Course Card Preview */}
                                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                                            {previewUrl && (
                                                <div className="aspect-video bg-gray-200">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Course preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <h4 className="font-semibold text-gray-900 mb-1">
                                                    {formData.courseTitle || 'Course Title'}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {formData.subTitle || 'Course subtitle will appear here'}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                                    <span className="text-lg font-bold text-emerald-600">
                                                        {formData.coursePrice ? `$${formData.coursePrice}` : 'Free'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formData.category || 'Category'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <FiUsers className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                                <p className="text-xs text-gray-500">Students</p>
                                                <p className="text-sm font-semibold text-gray-900">0</p>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <FiStar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                                <p className="text-xs text-gray-500">Rating</p>
                                                <p className="text-sm font-semibold text-gray-900">0.0</p>
                                            </div>
                                        </div>

                                        {/* Course Details */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                                <span className="text-sm text-gray-600">Level</span>
                                                <span className="text-sm font-medium text-emerald-700">{formData.courseLevel}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                <span className="text-sm text-gray-600">Category</span>
                                                <span className="text-sm font-medium text-blue-700">{formData.category || 'Not set'}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                <span className="text-sm text-gray-600">Status</span>
                                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                    course?.isPublished
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {course?.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Form Validation Status */}
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Form Validation</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { field: 'courseTitle', label: 'Course Title', value: formData.courseTitle },
                                                    { field: 'category', label: 'Category', value: formData.category },
                                                    { field: 'courseLevel', label: 'Level', value: formData.courseLevel },
                                                    { field: 'courseDescription', label: 'Description', value: formData.courseDescription }
                                                ].map((item) => (
                                                    <div key={item.field} className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            item.value && item.value.toString().trim() !== ''
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }`} />
                                                        <span className="text-xs text-gray-600">{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <FiEye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">Click "Preview" to see how your course will appear</p>
                                    </div>
                                )}

                                {/* Helpful Tips */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Quick Tips</h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• Use Ctrl+S (Cmd+S) to save quickly</li>
                                        <li>• Use Ctrl+P (Cmd+P) to toggle preview</li>
                                        <li>• Enable auto-save to prevent data loss</li>
                                        <li>• Use AI generation for better descriptions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default EditCourse;