import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProvinceManagement from '../components/ProvinceManagement';
import DistrictManagement from '../components/DistrictManagement';
import ManifestManagement from '../components/ManifestManagement';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'provinces' | 'districts' | 'manifests'>('manifests');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ElectInfo Admin</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.userName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('manifests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'manifests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manifests
            </button>
            <button
              onClick={() => setActiveTab('provinces')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'provinces'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Provinces
            </button>
            <button
              onClick={() => setActiveTab('districts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'districts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Districts
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'provinces' && <ProvinceManagement />}
        {activeTab === 'districts' && <DistrictManagement />}
        {activeTab === 'manifests' && <ManifestManagement />}
      </main>
    </div>
  );
};

export default AdminDashboard;
