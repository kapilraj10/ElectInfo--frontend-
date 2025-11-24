import { useState, useEffect } from 'react';
import { getDistricts, createDistrict, deleteDistrict, type District, } from '../services/Admin.ts';
import toast from 'react-hot-toast';

const DistrictManagement = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [newDistrict, setNewDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDistricts = async () => {
    try {
      const response = await getDistricts();
      setDistricts(response.districts);
    } catch (error: any) {
      toast.error('Failed to fetch districts');
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistrict.trim()) {
      toast.error('District name is required');
      return;
    }

    setLoading(true);
    try {
      await createDistrict(newDistrict);
      toast.success('District created successfully');
      setNewDistrict('');
      fetchDistricts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create district');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this district?')) return;

    try {
      await deleteDistrict(id);
      toast.success('District deleted successfully');
      fetchDistricts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete district');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New District</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newDistrict}
            onChange={(e) => setNewDistrict(e.target.value)}
            placeholder="District name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add District'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Districts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {districts.map((district) => (
                <tr key={district._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {district.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(district._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {districts.length === 0 && (
            <div className="text-center py-8 text-gray-500">No districts found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictManagement;
