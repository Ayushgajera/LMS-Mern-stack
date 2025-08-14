
import React, { useState, useEffect, useMemo } from 'react';
import {
  FiPlayCircle, FiCheckCircle, FiUser, FiClock, FiBookOpen, FiChevronDown,
  FiChevronUp, FiVideo, FiSmartphone, FiAward, FiHeart, FiLock
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { socket } from '../../extensions/socket';
import BuyCourseButton from '@/components/BuyCourseButton';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';
import { useGetPurchaseCourseQuery } from '@/features/api/paymentApi';
// import Loader from '@/components/Loader'; // Uncomment if you have a Loader component

function CourseContent() {
  const [openSection, setOpenSection] = useState(null);
  const [previewLecture, setPreviewLecture] = useState(null);

  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const { data: courses, isLoading, error, refetch } = useGetPurchaseCourseQuery(courseId);

  // Use API data if available, fallback to hardcoded
  const courseData = courses?.course || {};
  const purchased = courses?.purchased;

  const defaultCourse = {
    price: 1499,
    whatYouWillLearn: [
      'Build real-world React applications',
      'Understand React hooks and context',
      'Implement routing and navigation',
      'Manage state efficiently',
      'Integrate with APIs',
      'Deploy React apps',
    ],
    requirements: [
      'Basic HTML, CSS, and JavaScript',
      'No prior React experience needed',
      'A computer with internet access',
    ],
  };

  // Prefer API data if available
  const whatYouWillLearn = courseData.whatYouWillLearn || defaultCourse.whatYouWillLearn;
  const requirements = courseData.requirements || defaultCourse.requirements;
  const coursePrice = courseData.coursePrice || defaultCourse.price;

  // Memoize lectures
  const lectures = useMemo(() => Array.isArray(courseData.lectures) ? courseData.lectures : [], [courseData.lectures]);

  useEffect(() => {
    refetch();
    // Listen for course updates
    function handleCourseUpdated(updatedCourse) {
      if (updatedCourse._id === courseId) {
        // No need to set state, refetch will update data
        refetch();
      }
    }
    socket.on('courseUpdated', handleCourseUpdated);
    return () => {
      socket.off('courseUpdated', handleCourseUpdated);
    };
  }, [courseId, refetch]);

  const toggleSection = (idx) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <Loader /> */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error && (error.data?.message || error.status === 401)) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 mt-16 sm:px-6 lg:px-16 ">
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
        <div className="flex-1">
          <div className="mb-6 aspect-[16/9] overflow-hidden rounded-2xl shadow bg-gray-100">
            <img
              src={courseData.courseThumbnail || ''}
              alt="Course Thumbnail"
              className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
              onLoad={e => e.currentTarget.classList.remove('opacity-0')}
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">{courseData.courseTitle || 'Untitled Course'}</h1>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={courseData.creator?.photoUrl || ''}
                alt={courseData.creator?.name || 'Creator'}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <FiUser /> {courseData.creator?.name || 'Unknown'}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FiClock /> {courseData.duration || '--'}
                  <FiBookOpen className="ml-4" /> {lectures.length} Lectures
                </div>
              </div>
            </div>

            <div
              className="course-description max-w-none text-gray-800"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  (courseData.courseDescription || '').replace(
                    /<li><p>(.*?)<\/p><\/li>/g,
                    '<li>$1</li>'
                  ),
                  {
                    ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'span', 'a', 'img', 'blockquote', 'pre', 'code', 'hr'],
                    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style'],
                  }
                ),
              }}
            />
          </div>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {whatYouWillLearn.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <FiCheckCircle className="text-emerald-500" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Course Content</h2>
            <div className="divide-y">
              {lectures.length === 0 ? (
                <div className="text-gray-500 italic px-4 py-6">
                  No sections found for this course.
                </div>
              ) : (
                lectures.map((lecture, idx) => (
                  <div key={lecture._id || idx}>
                    <button
                      className="w-full flex justify-between items-center py-4 px-2 text-left hover:bg-gray-50 rounded"
                      onClick={() => toggleSection(idx)}
                    >
                      <span className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        {lecture?.lectureTitle || 'Untitled Lecture'}
                      </span>
                      {openSection === idx ? (
                        <FiChevronUp className="text-emerald-600 text-2xl" />
                      ) : (
                        <FiChevronDown className="text-gray-600 text-2xl" />
                      )}
                    </button>
                    {openSection === idx && (
                      <ul className="pl-4 pb-4">
                        <li
                          className={`flex flex-col sm:flex-row sm:items-center justify-between py-2 px-3 rounded 
                            ${lecture.isPreviewFree ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                          onClick={() => {
                            if (lecture.isPreviewFree) {
                              setPreviewLecture(lecture);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {lecture.isPreviewFree ? (
                              <FiPlayCircle className="text-emerald-500" />
                            ) : (
                              <FiLock className="text-gray-400" />
                            )}
                            <span className="text-gray-700 font-medium">{lecture?.lectureTitle || 'Untitled Lecture'}</span>
                            {lecture.isPreviewFree && (
                              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">
                                Free Preview
                              </span>
                            )}
                            {!lecture.isPreviewFree && (
                              <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                                Locked
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                            <span className="text-gray-500 text-sm">{lecture?.duration || '--'}</span>
                            <span className="text-gray-400 text-xs">{lecture?.description || ''}</span>
                          </div>
                        </li>
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {previewLecture && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-2xl w-full relative overflow-hidden">
                <div className="flex flex-col items-center p-0">
                  <div className="w-full bg-emerald-500 py-4 px-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white text-center w-full">{previewLecture.lectureTitle}</h3>
                    <button
                      className="absolute top-3 right-4 text-white hover:text-blue-200 text-4xl"
                      onClick={() => setPreviewLecture(null)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="w-full p-6 flex flex-col items-center">
                    {previewLecture.videoUrl ? (
                      <video
                        src={previewLecture.videoUrl}
                        controls
                        className="w-full rounded-lg mb-2 bg-black"
                      />
                    ) : (
                      <p className="text-gray-700 text-center">{previewLecture.description || 'No video available.'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/3 w-full sticky top-10">
          <div className="bg-white border border-gray-200 shadow rounded-xl overflow-hidden">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={courseData.courseThumbnail || ''}
                alt="Course Thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="text-3xl font-bold mb-1 text-gray-800">₹{coursePrice}</div>
              <div className="text-sm text-gray-500 line-through mb-4">₹{defaultCourse.price}</div>

              <div className="flex flex-col gap-2">
                {/* ✅ Wait until not loading before deciding */}
                {!isLoading && purchased === false && (
                  <BuyCourseButton courseId={courseData._id} refetch={refetch} />
                )}

                {/* ✅ Show Continue if purchased */}
                {!isLoading && purchased === true && (
                  <button
                    onClick={() => navigate(`/course-progress/${courseData._id}`)}
                    className="bg-green-200 text-green-700 py-2 rounded font-medium flex items-center justify-center gap-2 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheckCircle /> Continue
                  </button>
                )}

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
