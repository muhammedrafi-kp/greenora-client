import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Download, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Modal from '../common/Modal';
import { getUsers, updateUserStatus } from "../../services/adminService";
import toast from 'react-hot-toast';

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileUrl?: string;
  isBlocked: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showExportMessage, setShowExportMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };



  // Sample data remains the same
  // const users = [
  //   { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', status: 'active', imageUrl: null },
  //   { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 234-5678', status: 'blocked', imageUrl: null },
  //   { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 (555) 345-6789', status: 'active', imageUrl: null },
  //   { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 (555) 456-7890', status: 'active', imageUrl: null },
  //   { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '+1 (555) 567-8901', status: 'blocked', imageUrl: null },
  //   { id: 6, name: 'Emily Davis', email: 'emily@example.com', phone: '+1 (555) 678-9012', status: 'active', imageUrl: null },
  //   { id: 7, name: 'Chris Wilson', email: 'chris@example.com', phone: '+1 (555) 789-0123', status: 'active', imageUrl: null },
  //   { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '+1 (555) 890-1234', status: 'blocked', imageUrl: null },
  //   { id: 9, name: 'Tom Martin', email: 'tom@example.com', phone: '+1 (555) 901-2345', status: 'active', imageUrl: null },
  //   { id: 10, name: 'Amy Taylor', email: 'amy@example.com', phone: '+1 (555) 012-3456', status: 'active', imageUrl: null },
  //   { id: 11, name: 'David Clark', email: 'david@example.com', phone: '+1 (555) 123-4567', status: 'blocked', imageUrl: null },
  //   { id: 12, name: 'Rachel White', email: 'rachel@example.com', phone: '+1 (555) 234-5678', status: 'active', imageUrl: null }
  // ];

  // Filter users based on search term and status


  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'blocked' ? user.isBlocked : !user.isBlocked);
    return matchesSearch && matchesStatus;
  });

  // sort function
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let compareResult;
    if (sortField === 'name') {
      compareResult = a.name.localeCompare(b.name);
    } else if (sortField === 'email') {
      compareResult = a.email.localeCompare(b.email);
    } else {
      compareResult = a.name.localeCompare(b.name);
    }
    return sortDirection === 'asc' ? compareResult : -compareResult;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);


  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status'];
    const csvData = users.map((user) =>
      [user.name, user.email, user.phone, user.isBlocked].join(',')
    );
    const csvContent = [headers.join(','), ...csvData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    setShowExportMessage(true);
    setTimeout(() => setShowExportMessage(false), 3000);
  };


  const handleStatusChange = (user: IUser) => {
    if (!user?._id || !user?.name) {
      toast.error('Invalid user data');
      return;
    }
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser?._id) {
      toast.error('Invalid user selected');
      setShowModal(false);
      return;
    }

    try {
      setLoading(true);
      const response = await updateUserStatus(selectedUser._id);
      console.log(response)
      if (response.success) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === selectedUser._id
              ? { ...user, isBlocked: !user.isBlocked }
              : user
          )
        );

        toast.success(response.message);
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
      setSelectedUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';
      console.error('Error updating user status:', error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-6 py-4">
      <div className="max-w-7xl mx-auto bg-white border rounded-lg hover:shadow-md transition-all duration-300">
        <div className="p-6 space-y-6">
          {showExportMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-green-700">
                Users data exported successfully!
                <button onClick={() => setShowExportMessage(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-6 xs:px-6 px-4 py-3 bg-gray-50 border-b">
              <div className="flex items-center gap-2">
                <span className="xs:text-sm text-xs font-medium text-gray-600">Total Users:</span>
                <span className="xs:text-sm text-xs font-semibold text-gray-900">{users.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="xs:text-sm text-xs font-medium text-gray-600">Active:</span>
                <span className="xs:text-sm text-xs font-semibold text-green-800">
                  {users.filter(u => !u.isBlocked).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="xs:text-sm text-xs font-medium text-gray-600">Blocked:</span>
                <span className="xs:text-sm text-xs font-semibold text-red-800">
                  {users.filter(u => u.isBlocked).length}
                </span>
              </div>
            </div>

            {/*search and filter area */}
            <div className="flex gap-4 items-center ml-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none w-full md:w-64 bg-white shadow-sm"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={`${sortField}-${sortDirection}`}
                    onChange={(e) => {
                      const [field, direction] = e.target.value.split('-');
                      setSortField(field);
                      setSortDirection(direction);
                    }}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="email-asc">Email (A-Z)</option>
                    <option value="email-desc">Email (Z-A)</option>
                    {/* <option value="status-asc">Status (A-Z)</option>
                    <option value="status-desc">Status (Z-A)</option> */}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/*search and filter area end*/}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Full name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
                            {user.profileUrl ? (
                              <img src={user.profileUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleStatusChange(user)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!user.isBlocked
                            ? 'border border-red-700 hover:bg-red-700 text-gray-800 hover:text-white'
                            : 'border border-green-700 hover:bg-green-700 text-gray-800 hover:text-white'
                            }`}
                        >
                          {!user.isBlocked ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pagination area  */}

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length} users
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${currentPage === 1
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${currentPage === totalPages
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedUser && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Confirm ${!selectedUser.isBlocked ? 'Block' : 'Unblock'}`}
          description={`Are you sure you want to ${!selectedUser.isBlocked ? 'block' : 'unblock'} ${selectedUser.name}?`}
          confirmLabel="Confirm"
          onConfirm={confirmStatusChange}
          confirmButtonClass={`px-4 py-2 rounded-lg text-white ${!selectedUser.isBlocked
            ? 'bg-red-700 hover:bg-red-800'
            : 'bg-green-700 hover:bg-green-800'
            } transition-colors`}
        />
      )}
    </main>
  );
};

export default Users;
