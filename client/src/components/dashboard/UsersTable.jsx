import React from 'react';

const UsersTable = ({ users }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User Dashboard</h2>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">User Email</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Sign-up Timestamp</th>
            <th className="px-4 py-2">Login Count</th>
            <th className="px-4 py-2">Last Logout</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.signUpTimestamp} className="border-t">
              <td className="px-4 py-2 text-center">{user.email}</td>
              <td className="px-4 py-2 text-center">{user.username}</td>
              <td className="px-4 py-2 text-center">{user.signUpTimestamp}</td>
              <td className="px-4 py-2 text-center">{user.loginCount}</td>
              <td className="px-4 py-2 text-center">{user.lastLogoutTimestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
