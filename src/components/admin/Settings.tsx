import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertTriangle, Power, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';

interface ISettings {
  collectorRevenuePercentage: number;
  maintenanceMode: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<ISettings>({
    collectorRevenuePercentage: 0,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempRevenue, setTempRevenue] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // Simulating API call with dummy data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const dummyData = {
        success: true,
        settings: {
          collectorRevenuePercentage: 75,
          maintenanceMode: false
        }
      };
      
      if (dummyData.success) {
        setSettings(dummyData.settings);
        setTempRevenue(dummyData.settings.collectorRevenuePercentage);
      }
    } catch (error) {
      setError('Failed to fetch settings. Please try again later.');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input, numbers, and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === '' || (numValue >= 0 && numValue <= 100)) {
        setTempRevenue(value === '' ? 0 : numValue);
      }
    }
  };

  const handleMaintenanceToggle = () => {
    setShowMaintenanceModal(true);
  };

  const confirmMaintenanceToggle = async () => {
    try {
      setIsSaving(true);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      setSettings(prev => ({
        ...prev,
        maintenanceMode: !prev.maintenanceMode
      }));
      toast.success(`Maintenance mode ${!settings.maintenanceMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      toast.error('Failed to update maintenance mode');
    } finally {
      setIsSaving(false);
      setShowMaintenanceModal(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      setSettings(prev => ({
        ...prev,
        collectorRevenuePercentage: tempRevenue
      }));
      setIsEditing(false);
      toast.success('Settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempRevenue(settings.collectorRevenuePercentage);
    setIsEditing(false);
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
    <main className="flex-1 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
        </div> */}

        <div className="space-y-6">
          {/* Collector Revenue Card */}
          <div className="bg-white border rounded-lg hover:shadow-md transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Collector Revenue</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Current:</span>
                  <span className="text-sm font-semibold text-blue-900">{settings.collectorRevenuePercentage}%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={isEditing ? (tempRevenue === 0 ? '' : tempRevenue) : settings.collectorRevenuePercentage}
                      onChange={handleRevenueChange}
                      disabled={!isEditing}
                      placeholder="Enter percentage"
                      className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-950 focus:border-transparent outline-none ${
                        !isEditing ? 'bg-gray-50' : ''
                      }`}
                    />
                  </div>
                  <span className="text-gray-600">%</span>
                </div>
                <p className="text-sm text-gray-500">
                  Set the percentage of revenue that collectors will receive for each collection.
                </p>
                <div className="flex justify-end gap-3">
                  {isEditing && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={isEditing ? handleSaveSettings : handleEditClick}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            <Save className="w-5 h-5" />
                            Save
                          </>
                        ) : (
                          <>
                            <Edit className="w-5 h-5" />
                            Edit
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Mode Card */}
          <div className="bg-white border rounded-lg hover:shadow-md transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">System Status</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`text-sm font-semibold ${settings.maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                    {settings.maintenanceMode ? 'Maintenance' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Power className={`w-5 h-5 ${settings.maintenanceMode ? 'text-red-600' : 'text-green-600'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-xs text-gray-500">
                        {settings.maintenanceMode 
                          ? 'System is currently in maintenance mode'
                          : 'System is currently active and available'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleMaintenanceToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2 ${
                      settings.maintenanceMode ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  When maintenance mode is enabled, the system will be temporarily unavailable for users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      <Modal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        title={`${settings.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode`}
        description={`Are you sure you want to ${settings.maintenanceMode ? 'disable' : 'enable'} maintenance mode? ${
          !settings.maintenanceMode 
            ? 'This will temporarily make the system unavailable for users.' 
            : 'Users will be able to access the system again.'
        }`}
        confirmLabel={settings.maintenanceMode ? 'Disable' : 'Enable'}
        onConfirm={confirmMaintenanceToggle}
        confirmButtonClass={`px-4 py-2 rounded-lg text-white ${
          settings.maintenanceMode 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-red-600 hover:bg-red-700'
        } transition-colors`}
      >
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            {settings.maintenanceMode 
              ? 'Disabling maintenance mode will make the system available to all users again.'
              : 'Enabling maintenance mode will temporarily make the system unavailable for all users.'}
          </p>
        </div>
      </Modal>
    </main>
  );
};

export default Settings;
