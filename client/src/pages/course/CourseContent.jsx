import { useGetCourseByIdQuery } from '@/features/api/courseApi';
import React, { useState, useEffect } from 'react';
import {
  FiPlayCircle,
  FiCheckCircle,
  FiUser,
  FiClock,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
  FiVideo,
  FiSmartphone,
  FiAward,
  FiHeart,
  FiShoppingCart
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { socket } from '../../extensions/socket'; // ✅ import socket connection
function CourseContent() {
  const [openSection, setOpenSection] = useState(null);
  const [courseData, setCourseData] = useState(null);

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const { data: courses, isLoading } = useGetCourseByIdQuery(courseId);
  const course = {
    price: 1499,
    whatYouWillLearn: [
      "Build real-world React applications",
      "Understand React hooks and context",
      "Implement routing and navigation",
      "Manage state efficiently",
      "Integrate with APIs",
      "Deploy React apps"
    ],
    requirements: [
      "Basic HTML, CSS, and JavaScript",
      "No prior React experience needed",
      "A computer with internet access"
    ],
  };

  // Real-time socket listener
  useEffect(() => {
    if (courses?.course) {
      setCourseData(courses.course);
    }

    socket.on("courseUpdated", (updatedCourse) => {
      if (updatedCourse._id === courseId) {
        console.log("Real-time updated course:", updatedCourse);
        setCourseData(updatedCourse);
      }
    });

    return () => {
      socket.off("courseUpdated");
    };
  }, [courses, courseId]);

  const toggleSection = (idx) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  if (isLoading || !courseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 mt-16 sm:px-6 lg:px-16 ">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-emerald-700 hover:underline font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Thumbnail */}
          <div className="mb-6 aspect-[16/9] overflow-hidden rounded-2xl shadow bg-gray-100">
            <img
              src={courseData.courseThumbnail}
              alt="Course Thumbnail"
              className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
              onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
            />
          </div>

          {/* Intro */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{courseData.courseTitle}</h1>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={courseData.creator.photoUrl}
                alt={courseData.creator.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <FiUser /> {courseData.creator.name}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FiClock /> {courseData.duration}
                  <FiBookOpen className="ml-4" /> {courseData.lectures.length} Lectures
                </div>
              </div>
            </div>

            {/* Description */}
            <div
              className="course-description max-w-none text-gray-800"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  courseData.courseDescription?.replace(
                    /<li><p>(.*?)<\/p><\/li>/g,
                    '<li>$1</li>'
                  ),
                  {
                    ALLOWED_TAGS: [
                      'b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'span',
                      'a', 'img', 'blockquote', 'pre', 'code', 'hr'
                    ],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style'],
                  }
                ),
              }}
            />
          </div>

          {/* What You'll Learn */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.whatYouWillLearn.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <FiCheckCircle className="text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {course.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Lectures */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <div className="divide-y">
              {courseData.lectures.length === 0 ? (
                <div className="text-gray-500 italic px-4 py-6">
                  No sections found for this course.
                </div>
              ) : (
                courseData.lectures.map((section, idx) => (
                  <div key={idx}>
                    <button
                      className="w-full flex justify-between items-center py-4 px-2 text-left hover:bg-gray-50 rounded"
                      onClick={() => toggleSection(idx)}
                    >
                      <span className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        {section.lectureTitle}
                      </span>
                      {openSection === idx ? (
                        <FiChevronUp className="text-emerald-600" />
                      ) : (
                        <FiChevronDown className="text-gray-400" />
                      )}
                    </button>
                    {openSection === idx && section.lectures.length > 0 && (
                      <ul className="pl-4 pb-4">
                        {section.lectures.map((lecture, lidx) => (
                          <li
                            key={lidx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 rounded hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <FiPlayCircle className="text-emerald-500" />
                              <span className="text-gray-700 font-medium">{lecture.title}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                              <span className="text-gray-500 text-sm">{lecture.duration}</span>
                              <span className="text-gray-400 text-xs">{lecture.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3 w-full sticky top-10">
          <div className="bg-white border border-gray-200 shadow rounded-xl overflow-hidden">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={courseData.courseThumbnail}
                alt="Course Thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="text-3xl font-bold mb-1 text-gray-800">₹{courseData.coursePrice}</div>
              <div className="text-sm text-gray-500 line-through mb-4">₹{course.price}</div>

              <div className="flex flex-col gap-2">
                <button className="bg-purple-700 text-white py-2 rounded font-medium hover:bg-purple-800 flex items-center justify-center gap-2">
                  <FiShoppingCart /> Add to Cart
                </button>
                <button className="border border-purple-700 text-purple-700 py-2 rounded font-medium hover:bg-purple-50 flex items-center justify-center gap-2">
                  <FiHeart /> Wishlist
                </button>
                <button className="bg-gray-100 text-gray-800 py-2 rounded font-medium hover:bg-gray-200">
                  Share
                </button>
              </div>

              <p className="text-center text-sm mt-3 text-gray-500">30-Day Money-Back Guarantee</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2"><FiVideo /> 7.5 hours on-demand video</li>
                <li className="flex items-center gap-2"><FiSmartphone /> Access on mobile and TV</li>
                <li className="flex items-center gap-2"><FiAward /> Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
