
import './App.css'
import {Route,Routes}  from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Navbar from "./components/common/Navbar"
import OpenRoute from "./components/core/Auth/OpenRoute"
import PageNotFound from './pages/PageNotFound';
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/ForgotPassword"
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Contact from "./pages/Contact";
import { GrDashboard } from 'react-icons/gr';
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";
import MyProfile from './components/core/Dashboard/MyProfile';
import Settings from "./components/core/Dashboard/Settings/Settings";
import { ACCOUNT_TYPE } from './utils/constants';
import EditCourse from './components/core/Dashboard/EditCourse/EditCourse';



function App() {


  return (
   <div className='w-screen  min-h-screen  bg-richblack-900 flex flex-col font-inner'>
      <Navbar/>
      <Routes>
        <Route  path="/"  element={<Home/>} />

            <Route
          path="signup" element={
        <Signup />
          }
        />

     <Route path="/contact" element={<Contact />} />


        <Route
          path="login" element={
           <Login />
          }
        />

         <Route
          path="forgot-password" element={
              <ForgotPassword />
          }
        />

            {/* Page Not Found (404 Page ) */}
        <Route path="*" element={<PageNotFound />} />
    
    <Route
          path="update-password/:id" element={
      
              <UpdatePassword />
     
          }
        />


         <Route
          path="verify-email" element={
           
              <VerifyEmail />
        
          }
        />


        <Route path="about" element={
          <About/>
        }
        />



     <Route element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
        />




   <Route path="dashboard/my-profile"  element={<MyProfile/>}/>
   <Route path="dashboard/setting"  element={<Settings/>}/>

          {
          user?.account === ACCOUNT.STUDENT && (
            <>
              <Route path="dashboard/enrolledcourses" element={<EnrolledCourses />} />
              <Route path="dashboard/cart" element={<Cart />} />
            </>
          )
        }



        {
              user?.accountType  == ACCOUNT_TYPE.STUDENT &&(
                <>
                  <Route path ="dashboard/cart" element={<AddCourse/>} />
                  <Route path ="dashboard/my-courses" element={<MyCourses/>} />
                  <Route path ="dashboard/edit-course:courseId" element={<EditCourse/>} />

                </>
              )
        }


    



      </Routes>

  
         


   </div>
  )
}

export default App
