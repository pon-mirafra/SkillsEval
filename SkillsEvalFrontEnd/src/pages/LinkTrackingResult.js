import React from 'react';
import { useParams } from 'react-router-dom';
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';
import LinkingTrackingAnalytics from '../Components/LinkingTrackingAnalytics';

const LinkTrackingResult = () => {
  const { subjectId } = useParams();

  return (
    <>
      <Head />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <LinkingTrackingAnalytics subjectId={subjectId} />
        </div>
      </div>
    </>
  );
};

export default LinkTrackingResult;