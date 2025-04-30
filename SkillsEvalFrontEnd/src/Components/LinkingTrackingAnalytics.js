import { linkTrackedDetails } from '../Api-config/auth.api';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import _ from 'lodash';

const LinkingTrackingAnalytics = () => {
  const [trackingData, setTrackingData] = useState([])
  const { subjectId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const token = sessionStorage.getItem('token');
  console.log(subjectId)


  const fetchTrackingApiDetails = async () => {
    try {
      const response = await linkTrackedDetails(token, subjectId , {
        search: searchTerm,
        currentPage,
        perPage
      });
      setTrackingData(response.data.data);
      console.log("########")
      console.log(response.data)
      setTotalRecords(response.data.totalTests);
    } catch (error) {
      console.error('Error fetching candidate results:', error);
    }
  };
  useEffect(() => {
    fetchTrackingApiDetails()
  }, [subjectId, token, currentPage, perPage])

  // const debouncedSearch = _.debounce((search) => {
  //   setSearchTerm(search);
  // }, 500); // Debounce for 500 milliseconds

  useEffect(()=>{
    const getData = setTimeout(() => {
      fetchTrackingApiDetails()
    }, 500)
    return () => clearTimeout(getData)
  },[searchTerm])

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

  const renderLinkStatus = (row) => {
    const link = row.linkStatus;
    let bgColor = '';
    if (link === "Generated" ) {
      bgColor = 'bg-blue-400';
    } else if (link === "Expired") {
      bgColor = 'bg-red-400';
    } else {
      bgColor = 'bg-green-800';
    }
    return <div className={`rounded-lg px-2 py-1 text-white ${bgColor}`}>{row.linkStatus}</div>;
  };

  const renderTestStatus = (row) => {
    const test = row.testStatus;
    let bgColor = '';
    if (test === "Not Started" ) {
      bgColor = 'bg-yellow-400';
    } else if (test === "Ended") {
      bgColor = 'bg-green-400';
    } else {
      bgColor = 'bg-orange-400';
    }
    return <div className={`rounded-lg px-2 py-1 text-white ${bgColor}`}>{row.testStatus}</div>;
  };


  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true, width: '18%' },
    { name: 'Email', selector: (row) => row.email, sortable: true, width: '25%' },
    { name: 'Created At', selector: (row) => row.createdAt.substring(0, 10), sortable: true, width: '15%' },
    { name: 'Link', selector: (row) =><a href={row.testLink}>Test-Link</a>, sortable: true, width: '10%',style:{color:'blue',fontWeight:"500"} },
    { name: 'Link Status', cell: renderLinkStatus, sortable: true, width: '15%' },
    { name: 'TestStatus', cell: renderTestStatus, sortable: true, width: '17%' },
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
        width: '20px'
      },
    },
    rows: {
      style: {
        minHeight: '48px', // Override the row height
        minWidth: '20px'
      },
    },
    pagination: {
      style: {
        fontSize: '14px', // Font size for pagination controls
      },
    },
  };

  return (
    <div className="md:w-80 md:p-5 lg:w-3/4 lg:p-10  mx-auto mt-5">
      <h1 className="text-2xl font-bold">Subject Link Tracking</h1>
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
        data={trackingData}
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
}

export default LinkingTrackingAnalytics;