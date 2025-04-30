import React from 'react'
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';
import ResultCandidate from '../Components/ResultCandidate';
const Result = () => {
  return (
    <>
      <Head />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <ResultCandidate />
        </div>
      </div>
    </>
  );
}

export default Result