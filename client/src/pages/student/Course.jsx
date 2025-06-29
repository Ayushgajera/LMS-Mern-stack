import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiBook, FiStar, FiBookmark } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Course({ course,}) {
  console.log(course?._id);
  const navigate=useNavigate();
  return (
    <motion.div onClick={() => {navigate(`/course/${course._id}`)}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
        transform hover:-translate-y-1"
    >
      {/* Thumbnail Section with Fixed Aspect Ratio */}
     <div className="relative overflow-hidden rounded-t-xl aspect-[16/9] bg-gray-100">
  <img
    src={course.courseThumbnail}
    alt={course.courseTitle}
    className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
    onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0" />
  <button
    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200"
    aria-label="Bookmark course"
  >
    <FiBookmark className="w-4 h-4 text-gray-600" />
  </button>
  <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
    <span className="px-2 py-1 bg-white/90 rounded-lg text-sm font-medium">
      {course.courseLevel}
    </span>
    <span className="px-2 py-1 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-lg text-sm font-medium">
      Web Development
    </span>
  </div>
</div>


      {/* Content */}
      <div className="p-5 pt-2 space-y-2">
        {/* Subtitle above Title */}

        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 hover:text-emerald-600 transition-colors duration-200">
          {course.courseTitle}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-1">{course.subTitle}</p>

        {/* Instructor Section */}
        <div className="flex items-center gap-2">
          <img
            src={course.creator.photoUrl}
            alt={course.creator.name}
            className="w-9 h-9 rounded-full object-cover border"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{course.creator.name}</p>
            <p className="text-xs text-gray-500">Instructor</p>
          </div>
        </div>

        {/* Rating, Lessons, Duration */}
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <FiBook className="w-4 h-4 text-gray-400" />
            <span>{course.lectures.length} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4 text-gray-400" />
            <span>~5 hrs</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <FiStar className="w-4 h-4" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-xs text-gray-500">(123)</span>
          </div>
        </div>

        {/* Price Section */}
        <div>
          <span className="text-lg font-bold text-black">₹{course.coursePrice}</span>
        </div>

        {/* Enroll Button */}
        <button
          className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-medium rounded-lg
            hover:from-green-700 hover:to-emerald-600 transition-all duration-200 transform hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Enroll Now
        </button>
      </div>
    </motion.div>
  );
}

export default Course;
