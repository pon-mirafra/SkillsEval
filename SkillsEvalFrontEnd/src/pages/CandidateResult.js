// CandidateResult.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';
import ResultAnalytics from '../Components/ResultAnalytics';

const CandidateResult = () => {
  const { subjectId } = useParams();

  return (
    <>
      <Head />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <ResultAnalytics subjectId={subjectId} />
        </div>
      </div>
    </>
  );
};

export default CandidateResult;
