import React, { useState, useRef, useEffect } from "react";
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
  FiAward,
  FiRefreshCw,
  FiSettings,
  FiBookmark,
  FiEdit2,
  FiDownload,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCourseProgressQuery,
  useUpdateCourseProgressMutation,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
} from "@/features/api/courseProgressApi";
import {
  getLectureNotes,
  setLectureNotes,
  getBookmarkedLectures,
  toggleBookmarkLecture,
  getLastWatchedLecture,
  setLastWatchedLecture,
} from "@/utils";

function EnrolledCourseLectures() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const videoRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // API hooks
  const { data: courseData, error, isLoading, refetch } = useGetCourseProgressQuery(courseId);
  const [updateProgress] = useUpdateCourseProgressMutation();
  const [markCompleted, { isLoading: markingCompleted }] = useMarkAsCompletedMutation();
  const [markInCompleted, { isLoading: markingInCompleted }] = useMarkAsInCompletedMutation();

  // Data extraction
  const courseDetails = courseData?.data?.courseDetails || {};
  const progress = courseData?.data?.progress || [];
  const completed = courseData?.data?.completed || false;
  const courseLectures = Array.isArray(courseDetails.lectures) ? courseDetails.lectures : [];

  // Bookmarks (localStorage)
  const [bookmarkedLectures, setBookmarkedLectures] = useState(getBookmarkedLectures(courseId));

  // State for selected lecture
  const [selectedLecture, setSelectedLecture] = useState(null);

  // Notes (localStorage)
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");

  // State for watched lectures
  const watchedLectureIds = Array.isArray(progress)
    ? progress.filter((lp) => lp.viewed).map((lp) => lp.lectureId)
    : [];
  const [watchedLectures, setWatchedLectures] = useState(watchedLectureIds);

  // Video controls state
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoQuality, setVideoQuality] = useState("auto"); // For demo, not actual streaming quality

  // Resume last watched lecture (localStorage)
  useEffect(() => {
    let lastWatched = getLastWatchedLecture(courseId);
    let initialLecture = null;
    if (lastWatched) {
      initialLecture = courseLectures.find((l) => l._id === lastWatched);
    }
    if (!initialLecture && courseLectures.length > 0) {
      initialLecture = courseLectures[0];
    }
    setSelectedLecture(initialLecture);
    setWatchedLectures(watchedLectureIds);
    setBookmarkedLectures(getBookmarkedLectures(courseId));
    // eslint-disable-next-line
  }, [courseLectures.length, courseId, courseData?.data?.progress]);

  // Save last watched lecture
  useEffect(() => {
    if (selectedLecture) {
      setLastWatchedLecture(courseId, selectedLecture._id);
    }
  }, [selectedLecture, courseId]);

  // Navigation
  const currentIdx = selectedLecture
    ? courseLectures.findIndex((l) => l._id === selectedLecture._id)
    : -1;
  const goToPrev = () => {
    if (currentIdx > 0) setSelectedLecture(courseLectures[currentIdx - 1]);
  };
  const goToNext = () => {
    if (currentIdx < courseLectures.length - 1) setSelectedLecture(courseLectures[currentIdx + 1]);
  };

  // Mark lecture as watched/unwatched (calls backend)
  const toggleWatched = async (lectureId) => {
    try {
      await updateProgress({ courseId, lectureId });
      refetch();
    } catch (err) {
      // Optionally show error toast
    }
  };

  // Mark course as completed/incompleted (calls backend)
  const handleMarkCompleted = async () => {
    await markCompleted(courseId);
    refetch();
  };
  const handleMarkInCompleted = async () => {
    await markInCompleted(courseId);
    refetch();
  };

  // Auto mark as watched when 50% viewed
  const handleProgress = async () => {
    const video = videoRef.current;
    if (!video || !selectedLecture || watchedLectures.includes(selectedLecture._id)) return;
    const percent = (video.currentTime / video.duration) * 100;
    if (!isNaN(percent) && percent >= 50) {
      await updateProgress({ courseId, lectureId: selectedLecture._id });
      refetch();
    }
  };

  // Bookmarks
  const handleToggleBookmark = (lectureId) => {
    const updated = toggleBookmarkLecture(courseId, lectureId);
    setBookmarkedLectures(updated);
  };
  const isBookmarked = (lectureId) => bookmarkedLectures.includes(lectureId);

  // Notes
  const openNotesModal = () => {
    setCurrentNote(getLectureNotes(courseId, selectedLecture._id));
    setNotesModalOpen(true);
  };
  const saveNote = () => {
    setLectureNotes(courseId, selectedLecture._id, currentNote);
    setNotesModalOpen(false);
  };

  // Certificate download (dummy PDF)
  const handleDownloadCertificate = () => {
    const link = document.createElement('a');
    link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // Replace with your own
    link.download = `${courseDetails.courseTitle || 'certificate'}.pdf`;
    link.click();
  };

  // Sidebar
  const SidebarContent = (
    <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs md:max-w-none md:w-auto">
      <h2 className="text-lg font-semibold mb-4 text-emerald-700">Lectures</h2>
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {courseLectures.map((lecture) => (
          <li key={lecture._id}>
            <button
              className={`flex items-center w-full gap-2 px-3 py-2 rounded-lg transition group ${
                selectedLecture && selectedLecture._id === lecture._id
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => {
                setSelectedLecture(lecture);
                setSidebarOpen(false);
              }}
            >
              <FiPlayCircle className="text-emerald-500" />
              <span className="truncate flex-1 text-left">{lecture?.lectureTitle}</span>
              {watchedLectures.includes(lecture._id) && (
                <FiCheckCircle className="text-emerald-500 ml-2" title="Watched" />
              )}
              <button
                type="button"
                className={`ml-2 p-1 rounded-full ${isBookmarked(lecture._id) ? 'bg-yellow-200' : 'bg-gray-100'} hover:bg-yellow-300`}
                title={isBookmarked(lecture._id) ? 'Remove Bookmark' : 'Bookmark'}
                onClick={e => { e.stopPropagation(); handleToggleBookmark(lecture._id); }}
                aria-label="Bookmark"
              >
                <FiBookmark className={isBookmarked(lecture._id) ? 'text-yellow-600' : 'text-gray-400'} />
              </button>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-xs text-gray-400 text-center">
        Progress: {watchedLectures.length}/{courseLectures.length} watched
      </div>
      <div className="mt-4 flex flex-col gap-2 items-center">
        {completed ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-sm">
            <FiAward /> Course Completed!
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-full font-semibold text-sm">
            <FiPlayCircle /> In Progress
          </span>
        )}
        <button
          onClick={completed ? handleMarkInCompleted : handleMarkCompleted}
          className={`mt-2 px-3 py-1 rounded text-xs font-semibold flex items-center gap-2 ${
            completed
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
          disabled={markingCompleted || markingInCompleted}
        >
          {completed ? <FiRefreshCw /> : <FiCheckCircle />}
          {completed ? "Mark as Incomplete" : "Mark as Completed"}
        </button>
        {completed && (
          <button
            onClick={handleDownloadCertificate}
            className="mt-2 px-3 py-1 rounded text-xs font-semibold flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <FiDownload /> Download Certificate
          </button>
        )}
      </div>
    </div>
  );

  // Loading/Error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading course</h2>
          <p className="text-gray-600">{error.message}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Change playback speed
  const handleSpeedChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  // Change video quality (demo only, actual implementation needs multiple sources)
  const handleQualityChange = (e) => {
    setVideoQuality(e.target.value);
    // In real apps, switch video src based on quality
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-10">
      <div className="max-w-6xl mx-auto w-full py-8 px-2 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-emerald-700 transition"
            aria-label="Back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-emerald-700">{courseDetails.courseTitle}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-1/3">{SidebarContent}</aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
              >
                <FiMenu className="w-5 h-5" />
                Lectures
              </button>
            </div>

            {/* Mobile Sidebar Drawer */}
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
                    <h2 className="text-xl font-bold text-emerald-700">{selectedLecture.lectureTitle}</h2>
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
                      <button
                        onClick={openNotesModal}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                        title="Add/Edit Notes"
                      >
                        <FiEdit2 /> Notes
                      </button>
                      <button
                        onClick={() => handleToggleBookmark(selectedLecture._id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${isBookmarked(selectedLecture._id) ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}
                        title={isBookmarked(selectedLecture._id) ? 'Remove Bookmark' : 'Bookmark'}
                      >
                        <FiBookmark />
                        {isBookmarked(selectedLecture._id) ? 'Bookmarked' : 'Bookmark'}
                      </button>
                    </div>
                  </div>
                  <p className="mb-4 text-gray-600">{selectedLecture.description}</p>

                  {/* Video Controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <label htmlFor="speed" className="text-sm text-gray-700 font-medium">Speed:</label>
                      <select
                        id="speed"
                        value={playbackRate}
                        onChange={handleSpeedChange}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x (Normal)</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label htmlFor="quality" className="text-sm text-gray-700 font-medium">Quality:</label>
                      <select
                        id="quality"
                        value={videoQuality}
                        onChange={handleQualityChange}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="auto">Auto</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                      </select>
                    </div>
                  </div>

                  <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow">
                    {selectedLecture.videoUrl ? (
                      <video
                        ref={videoRef}
                        src={selectedLecture.videoUrl}
                        controls
                        controlsList="nodownload"
                        className="w-full h-full"
                        onTimeUpdate={handleProgress}
                        onContextMenu={(e) => e.preventDefault()}
                        playbackRate={playbackRate}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-lg font-semibold">
                        No video available for this lecture.
                      </div>
                    )}
                  </div>

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
                      disabled={currentIdx === courseLectures.length - 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition ${
                        currentIdx === courseLectures.length - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>

                  {/* Notes Modal */}
                  {notesModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                        <button
                          className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => setNotesModalOpen(false)}
                          aria-label="Close"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-bold mb-2 text-emerald-700">Notes for: {selectedLecture.lectureTitle}</h3>
                        <textarea
                          className="w-full min-h-[120px] border rounded p-2 mb-4"
                          value={currentNote}
                          onChange={e => setCurrentNote(e.target.value)}
                          placeholder="Write your notes here..."
                        />
                        <button
                          onClick={saveNote}
                          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-semibold"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  )}
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
