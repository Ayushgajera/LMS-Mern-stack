import Navbar from "./components/Navbar"
import { Button } from "./components/ui/button"
import Homepage from "./pages/homepage"
import Login from "./pages/Login"
import HeroSection from "./pages/student/herosection"
import ProfilePage from "./pages/student/profilepage"
import MainLayout from "./layout/mainLayout"
import { createBrowserRouter, Route } from "react-router-dom"
import { RouterProvider } from "react-router"
import MyLearning from "./pages/student/MyLearning"
import AdminLayout from "./pages/admin/AdminLayout"
import Dashboard from "./pages/admin/Dashbaord"
import CourseTable from "./pages/admin/course/CourseTable"
import AddCourse from "./pages/admin/course/addCourse"
import EditCourse from "./pages/admin/course/EditCourse"

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
        ]

      }

    ],


  },
  {
    path: "login",
    element: <Login />
  }
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
