import Navbar from "./components/Navbar"
import { Button } from "./components/ui/button"
import AdminProfilePage from "./pages/admin/adminprofilepage"
import Homepage from "./pages/homepage"
import Login from "./pages/Login"
import HeroSection from "./pages/student/herosection"
import ProfilePage from "./pages/student/profilepage"
import MainLayout from "./layout/mainLayout"
import { createBrowserRouter, Route } from "react-router-dom"
import { RouterProvider } from "react-router"
import MyLearning from "./pages/student/MyLearning"

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element:  <HeroSection/>
      },
      {
        path: "/profile",
        element: <ProfilePage />
      },
      {
        path: "/my-courses",
        element: <MyLearning />
      }
      
    ]
  },
  {
    path: "/login",
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
