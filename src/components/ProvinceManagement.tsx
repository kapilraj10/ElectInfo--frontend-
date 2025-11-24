import { useState, useEffect } from 'react';
import { getProvinces, createProvince, deleteProvince, type Province,  } from '../services/Admin.ts';
import toast from 'react-hot-toast';

const ProvinceManagement = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [newProvince, setNewProvince] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProvinces = async () => {
    try {
      const response = await getProvinces();
      setProvinces(response.provinces);
    } catch (error: any) {
      toast.error('Failed to fetch provinces');
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvince.trim()) {
      toast.error('Province name is required');
      return;
    }

    setLoading(true);
    try {
      await createProvince(newProvince);
      toast.success('Province created successfully');
      setNewProvince('');
      fetchProvinces();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create province');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this province?')) return;

    try {
      await deleteProvince(id);
      toast.success('Province deleted successfully');
      fetchProvinces();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete province');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Province</h2>
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newProvince}
            onChange={(e) => setNewProvince(e.target.value)}
            placeholder="Province name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Province'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Provinces</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {provinces.map((province) => (
                <tr key={province._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {province.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(province._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {provinces.length === 0 && (
            <div className="text-center py-8 text-gray-500">No provinces found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvinceManagement;
