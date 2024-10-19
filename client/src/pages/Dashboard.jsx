import React, { useState, useEffect } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import UsersTable from '../components/dashboard/UsersTable';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [statistic, setStatistic] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user-activity`, {
          withCredentials: true,
        });
        const userData = response.data;
        
        setUsers(userData);

        // Fetch user analytics data (for stats at the top)
        const analyticsResponse = await axios.get(`${BASE_URL}/user-analytics`, {
          withCredentials: true,
        });
        const analyticsData = analyticsResponse.data;
        setStatistic(analyticsData)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Stats card at the top */}
      <StatsCard
        statistic={statistic}
      />

      {/* Users table */}
      <UsersTable users={users} />
    </div>
  );
};

export default Dashboard;
