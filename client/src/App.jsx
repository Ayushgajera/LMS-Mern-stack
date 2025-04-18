import Navbar from "./components/Navbar"
import { Button } from "./components/ui/button"
import AdminProfilePage from "./pages/admin/adminprofilepage"
import Homepage from "./pages/homepage"
import Login from "./pages/Login"
import HeroSection from "./pages/student/herosection"
import ProfilePage from "./pages/student/profilepage"
function App() {
  return (
    <>
    
    <Navbar/>
    {/* <HeroSection/> */}
    {/* <ProfilePage/> */}
    <AdminProfilePage/>
    {/* <Login /> */}
    </>
      // <Homepage/>
    
  )
}

export default App
