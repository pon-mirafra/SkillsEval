import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { subjectTests, testCandidatesCount } from '../Api-config/auth.api'; // Ensure you have the correct path
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminHomePage = () => {
    const [subjectData, setSubjectData] = useState([]);
    const [totalTests, setTotalTests] = useState(0);
    const [totalCandidates, setTotalCandidates] = useState(0);
  
    useEffect(() => {
      const fetchData = async () => {
        const token = sessionStorage.getItem('token');
        try {
          const response = await subjectTests(token);
          setSubjectData(response.data.data);
          
          // Fetch total tests and total candidates
          const totalCountsResponse = await testCandidatesCount(token);
          setTotalTests(totalCountsResponse.data.totalTests);
          setTotalCandidates(totalCountsResponse.data.totalCandidates);
        } catch (error) {
          console.error('Error fetching subject test data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    const barChartData = {
      labels: subjectData.map(item => item.subject),
      datasets: [
        {
          label: 'Total Tests Taken',
          data: subjectData.map(item => item.totalTests),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    const pieChartData = {
      labels: subjectData.map(item => item.subject),
      datasets: [
        {
          label: 'Total Tests Taken',
          data: subjectData.map(item => item.totalTests),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(201, 203, 207, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  
    const barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Subject Analytics',
        },
      },
    };

    const pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Test Distribution by Subject',
        },
      },
    };
  
  return (
    <>
      <div className="flex justify-between">
        <div className=" mt-8 sm:w-full lg:w-1/2 mr-4">
          {/* parent */}
          <div >
            <div className="box flex gap-5" style={{ height: '150px' }}>
              <div className="total-test p-6 rounded-lg shadow-md">
                <p className="text-lg mb-2">Total Tests Taken</p>
                <h2 className="text-3xl mb-2 text-sky-900">{totalTests}</h2>
              </div>
              <div className="total-test p-6 rounded-lg shadow-md">
                <p className="text-lg mb-2">Total Candidates</p>
                <h2 className="text-3xl mb-2 text-sky-900">{totalCandidates}</h2>
              </div>
            </div>
          </div>
          <div className="total-test p-6 rounded-lg shadow-md mt-8" >
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        </div>
        <div className="total-test p-6 rounded-lg shadow-md mt-8 sm:w-full lg:w-1/2" >
        <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
      

       

      
    </>
  );
};

export default AdminHomePage;
