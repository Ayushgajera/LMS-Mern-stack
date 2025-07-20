import React, { useState, useRef, useEffect, useCallback } from "react";
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
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import { toast } from 'react-hot-toast';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';

// PDF styles for certificate
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#f8fafc',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  borderBox: {
    margin: 32,
    padding: 32,
    border: '6 solid #2563eb',
    borderRadius: 24,
    backgroundColor: '#fff',
    minHeight: 700,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(30,64,175,0.10)',
  },
  logoBox: {
    width: 90,
    height: 90,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  logoImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    objectFit: 'cover',
  },
  decorativeLine: {
    width: '60%',
    height: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
    marginBottom: 18,
  },
  heading: {
    fontSize: 36,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2563eb',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginVertical: 12,
    textAlign: 'center',
    borderBottom: '2 solid #93c5fd',
    paddingBottom: 6,
    marginBottom: 16,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  courseIcon: {
    fontSize: 20,
    color: '#2563eb',
    marginRight: 6,
  },
  course: {
    fontSize: 22,
    fontWeight: 700,
    color: '#2563eb',
    textAlign: 'center',
  },
  sealRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  seal: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fbbf24',
    border: '4 solid #d97706',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    marginRight: 12,
    marginLeft: 12,
  },
  sealText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 48,
    width: '100%',
    paddingHorizontal: 24,
  },
  dateBox: {
    textAlign: 'left',
    color: '#64748b',
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateIcon: {
    fontSize: 16,
    color: '#2563eb',
    marginRight: 4,
  },
  signatureBox: {
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  signatureLine: {
    width: 120,
    borderBottom: '2 solid #2563eb',
    marginBottom: 4,
    marginTop: 8,
    alignSelf: 'center',
  },
  signatureText: {
    color: '#2563eb',
    fontWeight: 600,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  signatureImg: {
    width: 80,
    height: 32,
    marginBottom: 2,
    objectFit: 'contain',
  },
  orgBox: {
    textAlign: 'right',
    color: '#1d4ed8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orgSub: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.08,
    fontSize: 80,
    color: '#2563eb',
    fontWeight: 'bold',
    zIndex: 0,
  },
});

const LOGO_DATA = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Apna_College_Logo.png'; // Example logo URL (replace with your own or a data URI)
const SIGNATURE_DATA = 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Signature_example.svg'; // Example signature SVG (replace with your own or a data URI)

const MyCertificate = ({ name, course, date }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {/* Watermark */}
      <Text style={pdfStyles.watermark}>EduLearn</Text>
      <View style={pdfStyles.borderBox}>
        {/* Logo/Branding */}
        <View style={pdfStyles.logoBox}>
          {/* If Image fails, fallback to text */}
          <Image src={LOGO_DATA} style={pdfStyles.logoImg} />
        </View>
        <View style={pdfStyles.decorativeLine}></View>
        <Text style={pdfStyles.heading}>Certificate of Completion</Text>
        <Text style={pdfStyles.subheading}>This is to certify that</Text>
        <Text style={pdfStyles.name}>{name}</Text>
        <Text style={pdfStyles.subheading}>has successfully completed the course</Text>
        <View style={pdfStyles.courseRow}>
          {/* Course Icon (SVG) */}
          <Svg width={20} height={20} style={pdfStyles.courseIcon} viewBox="0 0 20 20">
            <Path d="M10 2L2 6.5V8c0 5.25 3.75 10 8 10s8-4.75 8-10V6.5L10 2z" fill="#2563eb" />
          </Svg>
          <Text style={pdfStyles.course}>{course}</Text>
        </View>
        <View style={pdfStyles.sealRow}>
          <View style={pdfStyles.seal}>
            {/* Gold Ribbon SVG */}
            <Svg width={40} height={40} viewBox="0 0 40 40">
              <Path d="M20 4a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" fill="#fbbf24" stroke="#d97706" strokeWidth={3} />
              <Path d="M20 24v10M20 24l-6 8M20 24l6 8" stroke="#d97706" strokeWidth={3} fill="none" />
              <Text x={20} y={18} fontSize={16} fontWeight="bold" fill="#92400e" textAnchor="middle">★</Text>
            </Svg>
          </View>
        </View>
        <View style={pdfStyles.footerRow}>
          <View style={pdfStyles.dateBox}>
            {/* Date Icon (SVG) */}
            <Svg width={16} height={16} style={pdfStyles.dateIcon} viewBox="0 0 20 20">
              <Path d="M6 2v2M14 2v2M3 6h14M5 8v6m4-6v6m4-6v6" stroke="#2563eb" strokeWidth={1.5} fill="none" />
              <Path d="M3 6h14v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" stroke="#2563eb" strokeWidth={1.5} fill="none" />
            </Svg>
            <Text>Date of Completion</Text>
            <Text style={{ fontWeight: 600 }}>{date}</Text>
          </View>
          <View style={pdfStyles.signatureBox}>
            <Text style={pdfStyles.signatureText}>Instructor Signature</Text>
            {/* Signature Image (SVG or PNG) */}
            <Image src={SIGNATURE_DATA} style={pdfStyles.signatureImg} />
            <View style={pdfStyles.signatureLine}></View>
          </View>
          <View style={pdfStyles.orgBox}>
            <Text>EduLearn LMS</Text>
            <Text style={pdfStyles.orgSub}>Learning Management System</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

function EnrolledCourseLectures() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const videoRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: courseData, error, isLoading, refetch } = useGetCourseProgressQuery(courseId);
  const [updateProgress] = useUpdateCourseProgressMutation();
  const [markCompleted, { isLoading: markingCompleted }] = useMarkAsCompletedMutation();
  const [markInCompleted, { isLoading: markingInCompleted }] = useMarkAsInCompletedMutation();

  const courseDetails = courseData?.data?.courseDetails || {};
  const progress = courseData?.data?.progress || [];
  const completed = courseData?.data?.completed || false;
  const courseLectures = Array.isArray(courseDetails.lectures) ? courseDetails.lectures : [];

  const [bookmarkedLectures, setBookmarkedLectures] = useState(getBookmarkedLectures(courseId));
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");

  const watchedLectureIds = Array.isArray(progress)
    ? progress.filter((lp) => lp.viewed).map((lp) => lp.lectureId)
    : [];
  const [watchedLectures, setWatchedLectures] = useState(watchedLectureIds);

  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoQuality, setVideoQuality] = useState("auto");

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
  }, [courseLectures.length, courseId, courseData?.data?.progress]);

  useEffect(() => {
    if (selectedLecture) {
      setLastWatchedLecture(courseId, selectedLecture._id);
    }
  }, [selectedLecture, courseId]);

  const currentIdx = selectedLecture
    ? courseLectures.findIndex((l) => l._id === selectedLecture._id)
    : -1;
  const goToPrev = () => {
    if (currentIdx > 0) setSelectedLecture(courseLectures[currentIdx - 1]);
  };
  const goToNext = () => {
    if (currentIdx < courseLectures.length - 1) setSelectedLecture(courseLectures[currentIdx + 1]);
  };

  const toggleWatched = useCallback(async (lectureId) => {
    try {
      await updateProgress({ courseId, lectureId });
      refetch();
      toast.success(watchedLectures.includes(lectureId) ? "Lecture marked as unwatched!" : "Lecture marked as watched!");
    } catch (err) {
      toast.error('Failed to update lecture progress.');
      console.error("Error updating lecture progress:", err);
    }
  }, [courseId, refetch, updateProgress, watchedLectures]);

  const handleMarkCompleted = useCallback(async () => {
    try {
      await markCompleted(courseId);
      refetch();
      toast.success("Course marked as completed!");
    } catch (err) {
      toast.error("Failed to mark course as completed.");
      console.error("Error marking course completed:", err);
    }
  }, [courseId, markCompleted, refetch]);

  const handleMarkInCompleted = useCallback(async () => {
    try {
      await markInCompleted(courseId);
      refetch();
      toast.success("Course marked as incomplete!");
    } catch (err) {
      toast.error("Failed to mark course as incomplete.");
      console.error("Error marking course incomplete:", err);
    }
  }, [courseId, markInCompleted, refetch]);

  const handleProgress = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !selectedLecture || watchedLectures.includes(selectedLecture._id)) return;
    const percent = (video.currentTime / video.duration) * 100;
    if (!isNaN(percent) && percent >= 50) {
      try {
        await updateProgress({ courseId, lectureId: selectedLecture._id });
        refetch();
      } catch (err) {
        console.error("Error auto-updating lecture progress:", err);
      }
    }
  }, [selectedLecture, watchedLectures, courseId, updateProgress, refetch]);

  const handleToggleBookmark = useCallback((lectureId) => {
    const updated = toggleBookmarkLecture(courseId, lectureId);
    setBookmarkedLectures(updated);
    toast.success(updated.includes(lectureId) ? "Lecture bookmarked!" : "Bookmark removed!");
  }, [courseId]);

  const isBookmarked = useCallback((lectureId) => bookmarkedLectures.includes(lectureId), [bookmarkedLectures]);

  const openNotesModal = useCallback(() => {
    setCurrentNote(getLectureNotes(courseId, selectedLecture._id));
    setNotesModalOpen(true);
  }, [courseId, selectedLecture]);

  const saveNote = useCallback(() => {
    setLectureNotes(courseId, selectedLecture._id, currentNote);
    setNotesModalOpen(false);
    toast.success("Note saved!");
  }, [courseId, selectedLecture, currentNote]);

  // Certificate download (PDF)
  const certificateRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  const user = useSelector(state => state.auth.user);
  const username = user?.name || user?.username || 'Student';
  const courseTitle = courseDetails.courseTitle || 'Course Title';

  const downloadCertificate = useCallback(async () => {
    setIsDownloading(true);
    try {
      const certificateElement = certificateRef.current;
      if (!certificateElement) throw new Error("Certificate element not found.");

      // Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Ensure certificate is visible
      certificateElement.scrollIntoView({ behavior: "auto", block: "center" });
      await new Promise(res => setTimeout(res, 200));

      // Capture certificate gas image
      const canvas = await html2canvas(certificateElement, {
        useCORS: true,
        scale: 2,
        allowTaint: false,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL('image/png');
      if (!imgData || imgData.length < 100) throw new Error("Failed to capture certificate image.");

      // Create PDF
      const pdfWidth = canvas.width;
      const pdfHeight = canvas.height;
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate_${username.replace(/\s/g, '_')}_${courseTitle.replace(/\s/g, '_')}.pdf`);
      toast.success("Certificate downloaded successfully!");
    } catch (err) {
      toast.error(`Failed to generate certificate PDF: ${err.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsDownloading(false);
    }
  }, [certificateRef, username, courseTitle]);

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
        {/* Certificate download section */}
        {completed && (
          <div className="my-8 flex flex-col items-center">
            {/* PDF Download Button using @react-pdf/renderer */}
            <PDFDownloadLink
              document={<MyCertificate name={username} course={courseTitle} date={new Date().toLocaleDateString()} />}
              fileName={`certificate_${username.replace(/\s/g, '_')}_${courseTitle.replace(/\s/g, '_')}.pdf`}
              className="mb-4 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition flex items-center gap-2"
            >
              {({ loading }) => loading ? 'Generating PDF...' : 'Download Certificate'}
            </PDFDownloadLink>
            {/* Certificate preview removed as requested */}
          </div>
        )}
      </div>
    </div>
  );

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

  const handleSpeedChange = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const handleQualityChange = (e) => {
    setVideoQuality(e.target.value);
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
          <aside className="hidden md:block md:w-1/3">{SidebarContent}</aside>

          <main className="flex-1">
            <div className="md:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition"
              >
                <FiMenu className="w-5 h-5" />
                Lectures
              </button>
            </div>

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