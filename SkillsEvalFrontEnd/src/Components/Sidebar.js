import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { FaLink } from "react-icons/fa6";
import { VscGraph } from "react-icons/vsc";
import { MdOutlineDatasetLinked } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className=' top-12 h-screen sticky lg:w-48  p-5 shadow-xl bg-white'>
      <ul>
        {/* List of features */}
        <Link to='/home'>
          <li className={`flex items-center mt-2 rounded-lg ${location.pathname === '/home' ? 'bg-sky-900 text-white font-bold' : 'hover:bg-gray-200'} pl-2 py-2`}>
            <AiOutlineHome className='mr-3 text-xl' /> {/* Home Icon */}
            Home
          </li>
        </Link>
        <Link to='/createlink'>
          <li className={`flex items-center mt-2 rounded-lg ${location.pathname === '/createlink' ? 'bg-sky-900 text-white font-bold' : 'hover:bg-gray-200'} pl-2 py-2`}>
            <FaLink className='mr-3 text-xl' />
            Create Link
          </li>
        </Link>
        <Link to='/setqs'>
          <li className={`flex items-center mt-2 rounded-lg ${location.pathname === '/setqs' ? 'bg-sky-900 text-white font-bold' : 'hover:bg-gray-200'} pl-2 py-2`}>
            <FaRegQuestionCircle className='mr-3 text-xl'  />
            Set Questions
          </li>
        </Link>
        <Link to='/results'>
          <li className={`flex items-center mt-2 rounded-lg ${(location.pathname === '/results')||(location.pathname.startsWith('/results/') )? 'bg-sky-900 text-white font-bold' : 'hover:bg-gray-200'} pl-2 py-2`}>
            <VscGraph className='mr-3 text-xl' />
            Results
          </li>
        </Link>
        <Link to='/linkTracking'>
          <li className={`flex items-center mt-2 rounded-lg ${(location.pathname === '/linkTracking')||(location.pathname.startsWith('/linkTracking/') )? 'bg-sky-900 text-white font-bold' : 'hover:bg-gray-200'} pl-2 py-2`}>
           <MdOutlineDatasetLinked className='mr-3 text-xl' />
            Link Tracking
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
