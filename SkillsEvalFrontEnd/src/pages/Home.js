import React from 'react'
import Head from '../Components/Head'
import Sidebar from '../Components/Sidebar'
import AdminHomePage from '../Components/Home'

const Home = () => {
  return (
    <div className="flex flex-col">
      <Head />
      <div className="flex ">
        <div className="w-1/5"> {/* Adjust the width of the sidebar */}
          <Sidebar />
        </div>
        <div className ="w-4/5"> {/* Take up remaining space */}
          <AdminHomePage/>
        </div>
      </div>
    </div>
  )
}

export default Home
