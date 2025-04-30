import React from 'react'
import Sidebar from '../Components/Sidebar'
import Head from '../Components/Head'
import GenLink from '../Components/GenLink'

// Nested component for CreateLink route to include Head, Sidebar, and GenLink components
const CreateLink = () => {
  return (
    <>
      <Head />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <GenLink />
        </div>
      </div>
    </>
  );
};

export default CreateLink