import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ChangePasswordProps {
  onClose: () => void;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ onClose }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // TODO: Implement API call to change password
      console.log('Password change request:', passwords);
      onClose();
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 xs:p-6 p-4">
      <div className="bg-white rounded-lg shadow-lg sm:w-full max-w-md xs:p-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-lg xs:text-base text-sm font-semibold">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="xs:w-5 xs:h-5 w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block xs:text-sm text-xs font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 xs:py-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 xs:text-sm text-xs">{error}</div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="xs:px-4 xs:py-2 px-2 py-1 xs:text-sm text-xs bg-green-800 text-white rounded-lg hover:bg-green-900"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

