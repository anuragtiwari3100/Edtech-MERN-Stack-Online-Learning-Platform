
import './App.css'
import {Route,Routes}  from "react-router-dom";
import Home from "./pages/Home";

function App() {


  return (
   <div className='w-screen  min-h-screen  bg-richblack-900 flex flex-col font-inner'>
      <Routes>
        <Route  path="/"  element={<Home/>} />
      </Routes>
                  {/* <h1>Hellow jee  to welcome hai aapka mere web pe</h1> */}

   </div>
  )
}

export default App
