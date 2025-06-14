import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { FontSize } from '@/extensions/FontSize'; // Assuming you have a custom FontSize extension
import {
  FiSave, FiX, FiDollarSign, FiBook, FiGrid, FiImage, FiUpload, FiTarget, FiInfo,
  FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight, FiList
} from 'react-icons/fi';
import { useEditCourseMutation, useGetAllCoursesQuery, useGetCourseByIdQuery } from '@/features/api/courseApi';

function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize
    ],
    content: content,
    editable: true,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[200px] focus:outline-none'
      },
      handleDOMEvents: {
        focus: (view, event) => {
          // Prevent focus loss
          event.preventDefault();
          return false;
        }
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    }
  });

  // Maintain focus state
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      const cursorPos = editor.view.state.selection.$head.pos;
      editor.commands.setContent(content);
      // Restore cursor position
      editor.commands.setTextSelection(cursorPos);
    }
  }, [content, editor]);

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    editor?.commands.focus();
  };

  if (!editor) {
    return null;
  }

  const fontSizes = [
    { label: 'Default', value: '16px' },
    { label: 'Small', value: '14px' },
    { label: 'Large', value: '20px' },
    { label: 'Extra Large', value: '24px' }
  ];

  const handleFontSize = (size) => {
    editor.chain().focus().setFontSize(size).run()
  };

  // Update button click handlers to prevent default
  const handleButtonClick = (callback) => (e) => {
    e.preventDefault(); // Prevent form submission
    callback();
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${isFocused ? 'ring-2 ring-emerald-500' : ''}`}
      onClick={handleFocus}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        {/* Font Size Selector */}
        <select
          onChange={(e) => handleFontSize(e.target.value)}
          className="h-8 px-2 rounded border border-gray-200 text-sm focus:outline-none 
            focus:ring-2 focus:ring-emerald-500 focus:border-transparent mr-2"
          value={editor.getAttributes('textStyle').fontSize || ''}
        >
          <option value="">Font Size</option>
          {fontSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button" // Add button type
          onClick={handleButtonClick(() => editor.chain().focus().toggleBold().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Bold"
        >
          <FiBold className="w-4 h-4" />
        </button>
        <button
          type="button" // Add button type
          onClick={handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Italic"
        >
          <FiItalic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() => editor.chain().focus().toggleUnderline().run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Underline"
        >
          <FiUnderline className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={handleButtonClick(() => editor.chain().focus().setTextAlign('left').run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Align Left"
        >
          <FiAlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() => editor.chain().focus().setTextAlign('center').run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Align Center"
        >
          <FiAlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleButtonClick(() => editor.chain().focus().setTextAlign('right').run())}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Align Right"
        >
          <FiAlignRight className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-emerald-600' : 'text-gray-600'
            }`}
          title="Bullet List"
        >
          <FiList className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose max-w-none focus:outline-none cursor-text"
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}

function EditCourse() {
  const params = useParams();
  const courseId = params.courseId;
  console.log("Course ID:", courseId);
  const navigate = useNavigate();
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
  //get course by id Api call
  const { data: courseData, isLoading: isCourseLoading,error } = useGetCourseByIdQuery(courseId);
  //edit course Api call
  const [editCourse, { data, isLoading, isSuccess }] = useEditCourseMutation(courseId);
  console.log("Course Data:", courseData);
  const course = courseData?.course;
  useEffect(() => {
    if (course) {
      console.log("Setting course description:", course.courseDescription);
      setFormData({
        courseTitle: course.courseTitle || '',
        subTitle: course.subTitle || '',
        courseDescription: course.courseDescription || '',
        category: course.category || '',
        courseLevel: course.courseLevel || 'Beginner',
        coursePrice: course.coursePrice || '',
        courseThumbnail: null,
        isPublished: course.isPublished || false
      });
      if (course.courseThumbnail) {
        setPreviewUrl(course.courseThumbnail);
      }
    }
  }, [course]);

  const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Marketing',
    'Data Science',
    'Business'
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
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { courseTitle, subTitle, courseDescription, category, courseLevel, coursePrice, courseThumbnail, isPublished } = formData;

    // Prepare form data for submission
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('courseId', courseId);
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
  }
  // Handle success state
  if (isSuccess) {
    toast.success("Course updated successfully!");
    navigate('/admin/courses');
  }
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );

  }
  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-gray-500 text-sm">
            {isCourseLoading ? 'Loading course...' : 'Updating course...'}
          </p>
        </div>
      </div>
    );

  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Updated Header with Navigation */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
              <p className="mt-1 text-sm text-gray-500">
                Edit your course details or manage course content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/admin/courses/edit/${courseId}/lectures`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 
                  bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 
                  transition-colors duration-200 font-medium"
              >
                <FiBook className="w-4 h-4 mr-2" />
                Manage Course Content
              </Link>
              <button
                onClick={() => navigate('/admin/courses')}
                className="p-2.5 text-gray-400 hover:text-gray-500 rounded-lg border border-gray-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Add Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className="px-6 py-3 text-sm font-medium text-emerald-600 border-b-2 
              border-emerald-600 focus:outline-none"
          >
            Course Details
          </button>
        </div>

        <form className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <FiInfo className="w-5 h-5 text-emerald-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>

            {/* Course Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Course Title *
              </label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                className="block w-full px-4 py-2 border rounded-xl focus:ring-2 
                  focus:ring-emerald-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter a compelling course title"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Subtitle
              </label>
              <input
                type="text"
                name="subTitle"
                value={formData.subTitle}
                onChange={handleChange}
                className="block w-full px-4 py-2 border rounded-xl focus:ring-2 
                  focus:ring-emerald-500 focus:border-transparent transition-colors duration-200"
                placeholder="Add a subtitle to provide more context"
              />
            </div>

            {/* Category and Level Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border rounded-xl focus:ring-2 
                    focus:ring-emerald-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Course Level */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Course Level *
                </label>
                <select
                  name="courseLevel"
                  value={formData.courseLevel}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border rounded-xl focus:ring-2 
                    focus:ring-emerald-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  {courseLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Course Description
              </label>
              <RichTextEditor
                content={formData.courseDescription || ''} // Remove the default text
                onChange={(content) => {
                  setFormData(prev => ({
                    ...prev,
                    courseDescription: content
                  }));
                }}
              />
            </div>
          </div>

          {/* Price and Publication Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <FiDollarSign className="w-5 h-5 text-emerald-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Pricing & Publication</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Course Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="coursePrice"
                    value={formData.coursePrice}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 
                      focus:ring-emerald-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Published Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 
                    border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Make this course public
                </label>
              </div>
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <div className="flex items-center">
              <FiImage className="w-5 h-5 text-emerald-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Course Thumbnail</h2>
            </div>

            <div className="mt-1 flex flex-col items-center">
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
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
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg 
                      hover:bg-red-600 transition-colors duration-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full cursor-pointer">
                  <div className="w-full aspect-video border-2 border-dashed border-gray-300 
                    rounded-xl flex flex-col items-center justify-center hover:border-emerald-500 
                    transition-colors duration-200 bg-gray-50">
                    <FiImage className="w-12 h-12 text-gray-400" />
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 
                        text-emerald-600 rounded-lg text-sm font-medium">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button onClick={handleSubmit}
              disabled={isLoading}
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent 
                rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 
                hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default EditCourse;