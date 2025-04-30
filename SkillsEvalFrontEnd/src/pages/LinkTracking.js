import React from 'react'
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';
import LinkingTrackingCandidate from '../Components/LinkingTrackingCandidate';
const LinkTracking = () => {
  return (
    <>
      <Head />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <LinkingTrackingCandidate />
        </div>
      </div>
    </>
  );
}

export default LinkTracking;