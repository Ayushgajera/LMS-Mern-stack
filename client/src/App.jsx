import Login from "./pages/Login"
import HeroSection from "./pages/student/herosection"
import ProfilePage from "./pages/student/profilepage"
import MainLayout from "./layout/MainLayout"
import { createBrowserRouter } from "react-router-dom"
import { RouterProvider } from "react-router"
import MyLearning from "./pages/student/MyLearning"
import AdminLayout from "./pages/admin/AdminLayout"
import Dashboard from "./pages/admin/Dashbaord"
import CourseTable from "./pages/admin/course/CourseTable"
import AddCourse from "./pages/admin/course/addCourse"
import EditCourse from "./pages/admin/course/EditCourse"
import CreateLectures from "./pages/admin/lecture/CreateLectures"
import EditLecture from "./pages/admin/lecture/EditLecture"
import CourseContent from "./pages/course/CourseContent"
import EnrolledCourseLectures from "./pages/student/EnrolledCourseLectures"

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HeroSection />
      },
      {
        path: "profile",
        element: <ProfilePage />
      },
      {
        path: "my-courses",
        element: <MyLearning />
      },
      {
        path: "course/:courseId",
        element: <CourseContent />
      },
      {
        path: "/course-progress/:courseId",
        element: <EnrolledCourseLectures />
      },


      // Admin Routes
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "courses",
            element: <CourseTable />
          },
          {
            path: "courses/create",
            element: <AddCourse />
          },
          {
            path: "courses/edit/:courseId",
            element: <EditCourse />
          },
          {
            path: "courses/edit/:courseId/lectures",
            element: <CreateLectures />
          },
          {
            path: "courses/edit/:courseId/lectures/:lectureId",
            element: <EditLecture />
          },
        ]

      }

    ],


  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "register",
    element: <Login />
  },
  {
    path: "/enrolled/lectures",
    element: <EnrolledCourseLectures />
  },

]);
function App() {

  return (
    <>
      <main>
        <RouterProvider router={appRouter} />
      </main>
      {/* <Navbar/> */}


      {/* <ProfilePage/> */}
      {/* <MyCourses /> */}
      {/* <AdminProfilePage/> */}
      {/* <Sellerdashboard/> */}
      {/* <Login /> */}
    </>

  )
}

export default App
