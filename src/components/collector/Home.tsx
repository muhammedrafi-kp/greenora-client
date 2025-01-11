import React from 'react';
import { UserCircle, ClipboardList, CheckCircle, Bell } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teams</h1>
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <span className="sr-only">Menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button className="bg-gray-200 px-6 py-2 rounded-lg font-medium">Personal</button>
          <button className="text-gray-600 px-6 py-2 rounded-lg border border-dashed border-gray-300 hover:border-gray-400">
            + Create Team
          </button>
        </div>

        <h2 className="text-2xl mb-4">Hi Admin, good afternoon!</h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <UserCircle className="w-12 h-12 text-gray-400" />
              <div>
                <h3 className="text-xl font-semibold">Admin</h3>
                <p className="text-gray-600">View your profile</p>
              </div>
            </div>
            <button className="text-gray-600 hover:text-gray-800">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
          </div>
        </div>

        {/* Task Cards */}
        <div className="col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold">Pending Tasks</h3>
          </div>
          <p className="text-gray-600">Tasks awaiting completion</p>
        </div>

        <div className="col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold">Completed Tasks</h3>
          </div>
          <p className="text-gray-600">Successfully finished tasks</p>
        </div>

        <div className="col-span-1 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Newly Assigned Tasks</h3>
          </div>
          <p className="text-gray-600">Recently assigned tasks</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;