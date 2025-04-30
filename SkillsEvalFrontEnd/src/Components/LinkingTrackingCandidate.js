import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjectDetails } from '../Api-config/auth.api';
import {LinkingsubjectDetails} from'../Api-config/auth.api';
import DataTable from 'react-data-table-component';
import _ from 'lodash';

const LinkingTrackingCandidate = () => {
  const [linkResults,setLinkResults]=useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0); // Add this state
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchLinkingData();
  }, [token, currentPage, perPage]);

  const fetchLinkingData = async () => {
    try {
      const response = await LinkingsubjectDetails(token, { search: searchTerm, currentPage, perPage });
      setLinkResults(response.data.data);
      console.log("#######")
      console.log(response.data.data)
      setTotalRecords(response.data.totalCount); // Set the total records
      console.log(response.data.totalCount)
    } catch (error) {
      console.error('Error fetching subject details:', error);
    }
  };

// *************************
  // useEffect(() => {
  //   fetchData();
  // }, [token, currentPage, perPage, searchTerm]);

  // const fetchData = async () => {
  //   try {
  //     const response = await subjectDetails(token, { search: searchTerm, currentPage, perPage });
  //     setResults(response.data.data);
  //     console.log(response.data.data)
  //     setTotalRecords(response.data.totalCount); // Set the total records
  //     console.log(response.data.totalCount)
  //   } catch (error) {
  //     console.error('Error fetching subject details:', error);
  //   }
  // };

  // const debouncedSearch = _.debounce((search) => {
  //   setSearchTerm(search);
  // }, 500); // Debounce for 500 milliseconds

  useEffect(()=>{
    const getData = setTimeout(() => {
      fetchLinkingData()
    }, 500)
    return () => clearTimeout(getData)
  },[searchTerm])

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    // debouncedSearch(value);
  };

  const handleSubjectClick = (row) => {
    navigate(`/linkTracking/subject/${row.id}`)
   // navigate(`/results/candidate/result/${row.id}/analytics`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage, currentPage) => {
    setCurrentPage(1); // Reset current page when changing rows per page
    setPerPage(newPerPage);
  };

  const columns = [
    { name: 'Subject', selector: (row) => row.subject, sortable: true },
    { name: 'Completed', selector: (row) => row.totalCompleted, sortable: true },
    { name: 'Generated', selector: (row) => row.totalGenerated, sortable: true },
    {
      name: 'Result',
      cell: (row) => (
        <button
          className="px-2 py-1 viewResultButton text-white bg-sky-800 rounded  hover:bg-sky-900 w-3/4"
          onClick={() => handleSubjectClick(row)}
        >
          View
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        // backgroundColor: '#00bfff', // Set the background color of the table header to blue
        backgroundColor: '#075985', // Set the background color of the table header to blue
      },
    },
    headCells: {
      style: {
        color: 'white', // Set the text color to white
        fontWeight: 'bold', // Make the font bold
        fontSize: '16px', // Set the font size
      },
    },
    rows: {
      style: {
        '&:hover': {
          backgroundColor: '#f8fafc', // Change row background color on hover
        },
      },
    },
  };

  return (
    <div className="md:w-90 md:p-5 lg:w-full max-w-2xl lg:tableView  mx-auto mt-5">
      <label htmlFor="search" className="block text-black-700 font-bold text-left text-2xl">
        Link Tracking
      </label>
      <form className="mb-4 flex  items-center">
        <input
          type="text"
          id="search"
          className="form-input mt-2 py-1 px-1 w-1/2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-400"
          placeholder="Search by subject"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>

      <div className="overflow-hidden max-h-[800px]">
        <DataTable
          title=""
          columns={columns}
          data={linkResults}
          pagination
          paginationServer
          paginationTotalRows={totalRecords} // Use totalRecords for pagination total rows
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 40]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerPageChange}
          // fixedHeader
          // fixedHeaderScrollHeight="420px"
          customStyles={customStyles}
        />
        
      </div>
      
    </div>
  );
};

export default LinkingTrackingCandidate;
