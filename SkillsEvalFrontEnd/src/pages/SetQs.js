import React from 'react'
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';
import SetQuestion from '../Components/SetQuestion';
const SetQs = () => {
  return (
    <>
      <Head />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <SetQuestion />
        </div>
      </div>
    </>
  );
}

export default SetQs