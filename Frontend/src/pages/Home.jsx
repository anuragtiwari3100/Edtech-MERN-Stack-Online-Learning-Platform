import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";


const Home = () => {
  return (
      <div> 
        welcome to the !! Home
        {/* Section 1 */}
        
        <Link to={"/signup"}>
         <div>
              <div>
                <p>become an Instructor</p>
                 <FaArrowRight />
              </div>
             
         </div>

        </Link>

        {/* Section 2 */}

        {/* Section 3 */}

        {/* footer */}




      </div>
  )
}

export default Home