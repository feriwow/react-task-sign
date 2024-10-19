import React, { useState } from 'react';
import axios from 'axios';
import { validatePassword } from '../helper/passwordValidator';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ResetPassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // Handle form submission
    const handlePasswordReset = async (e) => {
        e.preventDefault();

        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            setStatusMessage(`Failed to reset password.\n${passwordErrors.join('\n')}`);
            return;
        }

        // Check if new password matches the re-entered password
        if (newPassword !== reenterPassword) {
            setStatusMessage('New passwords do not match.');
            return;
        }

        try {
            // API call to verify and reset password
            const response = await axios.post(`${BASE_URL}/resetPassword`, {
                oldPassword: oldPassword,
                newPassword: newPassword,
            }, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setStatusMessage('Password successfully updated!');
                setOldPassword('');
                setNewPassword('');
                setReenterPassword('');
            } else {
                setStatusMessage('Error updating password.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setStatusMessage('Old password is incorrect.');
            } else {
                console.error('Error resetting password:', error);
                setStatusMessage('Failed to reset password.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold mb-6">Reset Password</h1>
            <form onSubmit={handlePasswordReset} className="space-y-4">
                {/* Old Password */}
                <div>
                    <label className="block mb-2 font-medium">Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                    />
                </div>

                {/* New Password */}
                <div>
                    <label className="block mb-2 font-medium">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                    />
                </div>

                {/* Re-enter New Password */}
                <div>
                    <label className="block mb-2 font-medium">Re-enter New Password</label>
                    <input
                        type="password"
                        value={reenterPassword}
                        onChange={(e) => setReenterPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded-lg w-full"
                >
                    Save Password
                </button>
            </form>

            {/* Status Message */}
            {statusMessage && (
                <p style={{ whiteSpace: 'pre-line' }} className={`mt-4 ${statusMessage.includes('Failed') || statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
};

export default ResetPassword;
