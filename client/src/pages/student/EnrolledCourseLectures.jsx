import React, { useState, useRef } from "react";
import {
  FiPlayCircle,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const demoLectures = [
  {
    _id: "1",
    title: "Introduction to React",
    description: "Get an overview of React and its core concepts.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    _id: "2",
    title: "JSX and Rendering",
    description: "Learn how JSX works and how to render elements.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    _id: "3",
    title: "Components and Props",
    description: "Understand components and how to pass data via props.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

function EnrolledCourseLectures() {
  const [lectures] = useState(demoLectures);
  const [courseTitle] = useState("React Mastery Bootcamp");
  const [selectedLecture, setSelectedLecture] = useState(demoLectures[0]);
  const [watchedLectures, setWatchedLectures] = useState([demoLectures[0]._id]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const videoRef = useRef();
  const navigate = useNavigate();

  // Navigation handlers
  const currentIdx = lectures.findIndex((l) => l._id === selectedLecture?._id);
  const goToPrev = () => {
    if (currentIdx > 0) setSelectedLecture(lectures[currentIdx - 1]);
  };
  const goToNext = () => {
    if (currentIdx < lectures.length - 1) setSelectedLecture(lectures[currentIdx + 1]);
  };

  // Mark as watched/unwatched
  const toggleWatched = (lectureId) => {
    setWatchedLectures((prev) =>
      prev.includes(lectureId)
        ? prev.filter((id) => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  // Automatically mark as watched when 80% viewed
  const handleProgress = () => {
    const video = videoRef.current;
    if (!video || watchedLectures.includes(selectedLecture._id)) return;
    const percent = (video.currentTime / video.duration) * 100;
    if (percent >= 80) {
      setWatchedLectures((prev) =>
        prev.includes(selectedLecture._id)
          ? prev
          : [...prev, selectedLecture._id]
      );
    }
  };

  // Sidebar content (for reuse in desktop and mobile)
  const SidebarContent = (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs md:max-w-none md:w-auto">
      <h2 className="text-lg font-semibold mb-4 text-emerald-700">Lectures</h2>
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {lectures.map((lecture) => (
          <li key={lecture._id}>
            <button
              className={`flex items-center w-full gap-2 px-3 py-2 rounded-lg transition group ${
                selectedLecture && selectedLecture._id === lecture._id
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                setSelectedLecture(lecture);
                setSidebarOpen(false); // close drawer on mobile
              }}
            >
              <FiPlayCircle className="text-emerald-500" />
              <span className="truncate flex-1 text-left">{lecture.title}</span>
              {watchedLectures.includes(lecture._id) && (
                <FiCheckCircle className="text-emerald-500 ml-2" title="Watched" />
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-xs text-gray-400 text-center">
        Progress: {watchedLectures.length}/{lectures.length} watched
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50  pt-10">
      <div className="max-w-6xl mx-auto w-full py-8 px-2 sm:px-6">
        {/* Back Button and Title */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-emerald-700 transition"
            aria-label="Back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-emerald-700">{courseTitle}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-1/3">{SidebarContent}</aside>

          {/* Main: Video Player and Details */}
          <main className="flex-1">
            {/* Mobile: Sidebar Drawer Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
              >
                <FiMenu className="w-5 h-5" />
                Lectures
              </button>
            </div>
            {/* Mobile: Sidebar Drawer */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 flex">
                <div
                  className="fixed inset-0 bg-black bg-opacity-30"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="relative z-50 w-80 max-w-full h-full bg-white shadow-xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-emerald-700">Lectures</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                      aria-label="Close"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  {SidebarContent}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-6 min-h-[400px] flex flex-col">
              {selectedLecture ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                    <h2 className="text-xl font-bold text-emerald-700">{selectedLecture.title}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleWatched(selectedLecture._id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                          watchedLectures.includes(selectedLecture._id)
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {watchedLectures.includes(selectedLecture._id) ? (
                          <>
                            <FiEyeOff /> Mark as Unwatched
                          </>
                        ) : (
                          <>
                            <FiEye /> Mark as Watched
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-600">{selectedLecture.description}</p>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow">
                    <video
                      ref={videoRef}
                      src={selectedLecture.videoUrl}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full"
                      onTimeUpdate={handleProgress}
                      onContextMenu={e => e.preventDefault()}
                    />
                  </div>
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-auto">
                    <button
                      onClick={goToPrev}
                      disabled={currentIdx === 0}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
                        currentIdx === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <FiChevronLeft /> Previous
                    </button>
                    <button
                      onClick={goToNext}
                      disabled={currentIdx === lectures.length - 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
                        currentIdx === lectures.length - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 text-center py-16">
                  Select a lecture to watch the video.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <footer className="w-full py-4 bg-white border-t text-gray-500 text-center mt-auto">
        &copy; {new Date().getFullYear()} React Mastery Bootcamp &mdash; All rights reserved.
      </footer>
    </div>
  );
}

export default EnrolledCourseLectures;