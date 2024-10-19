import React from 'react';

const StatsCard = ({ statistic }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Total Number of Users</h3>
            <p className="text-4xl font-bold mt-2">{statistic.totalSignups}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Active Sessions Today</h3>
            <p className="text-4xl font-bold mt-2">{statistic.activeUsersToday}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h3 className="text-xl font-semibold">Average Active Sessions (Last 7 Days)</h3>
            <p className="text-4xl font-bold mt-2">{statistic.averageActiveUsers}</p>
          </div>
        </div>
    );
};

export default StatsCard;
