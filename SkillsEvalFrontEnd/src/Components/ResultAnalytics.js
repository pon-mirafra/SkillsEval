import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { candidatesResult } from '../Api-config/auth.api';
import DataTable from 'react-data-table-component';
import _ from 'lodash';

const ResultAnalytics = () => {
  const { subjectId } = useParams();
  const [candidatesData, setCandidatesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchCandidatesData();
  }, [subjectId, token, currentPage, perPage]);

  const fetchCandidatesData = async () => {
    try {
      const response = await candidatesResult(token, subjectId, {
        search: searchTerm,
        currentPage,
        perPage
      });
      setCandidatesData(response.data.data);
      console.log(response.data.data)
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error('Error fetching candidate results:', error);
    }
  };

  useEffect(()=>{
    const getData = setTimeout(() => {
      fetchCandidatesData()
    }, 500)
    return () => clearTimeout(getData)
  },[searchTerm])

  // const debouncedSearch = _.debounce((search) => {
  //   setSearchTerm(search);
  // }, 500); // Debounce for 500 milliseconds

  const handleSearchChange = (e) => {
    const { value } = e.target;
    console.log(value)
    setSearchTerm(value);
    // debouncedSearch(value);
  
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

 
  const handlePerPageChange = (newPerPage, currentPage) => {
    setCurrentPage(1); // Reset current page when changing rows per page
    setPerPage(newPerPage);
  };

  const renderScore = (row) => {
    const score = parseFloat(row.score);
    let bgColor = '';
    if (score >= 7) {
      bgColor = 'bg-green-400';
    } else if (score >= 5 && score < 7) {
      bgColor = 'bg-orange-400';
    } else {
      bgColor = 'bg-red-400';
    }
    return <div className={`rounded-lg px-2 py-1 text-white ${bgColor}`}>{row.score}</div>;
  };

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true,width:'20%' },
    { name: 'Email', selector: (row) => row.email, sortable: true,width:'20%' },
    { name: 'Subject', selector: (row) => row.subject, sortable: true,width:'12%' },
    { name: 'Date', selector: (row) => row.date, sortable: true,width:'11%'},
    { name: 'Score', cell: renderScore, sortable: true,width:'11%' },
    { name: 'Duration', selector: (row) => row.duration, sortable: true,width:'14%' },
    {
      name: 'Report',
      cell: (row) => (
        <button
          className="px-2 py-1 viewResultButton text-white bg-sky-800 rounded  hover:bg-sky-900,width:'5%"
        >
          View
        </button>
        // <a href={row.reportUrl} target="_blank" rel="noopener noreferrer">
        //   View Report
        // </a>
      ),
      ignoreRowClick: true,
      // width:'10%',
      allowOverflow: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#0C4A6E', // Set the background color of the table header to blue
      },
    },
    headCells: {
      style: {
        color: 'white', // Dark text color for header cells
        fontWeight: 'bold', // Bold font for header cells
        fontSize: '14px', // Font size for header cells
      },
    },
    cells: {
      style: {
        fontSize: '14px', // Font size for cells
        padding: '8px 12px', // Padding for cells
        width:'20px'
      },
    },
    rows: {
      style: {
        minHeight: '48px', // Override the row height
        minWidth:'20px'
      },
    },
    pagination: {
      style: {
        fontSize: '14px', // Font size for pagination controls
      },
    },
  };

  return (
    <div className="md:w-90 md:p-5 lg:w-3/4 lg:p-10  mx-auto mt-5">
      <h1 className="text-2xl font-bold">Candidate Results</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          className="form-input mt-2 py-1 px-1 lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-gray-400"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <DataTable
        columns={columns}
        data={candidatesData}
        customStyles={customStyles}
        pagination
        paginationServer
        paginationTotalRows={totalRecords}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[10, 20, 30, 40]}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerPageChange}
      />
    </div>
  );
};

export default ResultAnalytics;
