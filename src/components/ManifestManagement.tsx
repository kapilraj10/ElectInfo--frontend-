import { useState, useEffect } from 'react';
import {
  getManifests,
  createManifest,
  deleteManifest,
  updateManifest,
  getProvinces,
  getDistricts,
    type Manifest,
    type Province,
    type District,
} from '../services/Admin.ts';
import toast from 'react-hot-toast';

const ManifestManagement = () => {
  const [manifests, setManifests] = useState<Manifest[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateParty: '',
    discraption: '',
    electionDate: '',
    province: '',
    district: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const [manifestsRes, provincesRes, districtsRes] = await Promise.all([
        getManifests(),
        getProvinces(),
        getDistricts(),
      ]);
      setManifests(manifestsRes.manifests);
      setProvinces(provincesRes.provinces);
      setDistricts(districtsRes.districts);
    } catch (error: any) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      candidateName: '',
      candidateParty: '',
      discraption: '',
      electionDate: '',
      province: '',
      district: '',
    });
    setPdfFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candidateName || !formData.candidateParty || !formData.discraption ||
        !formData.electionDate || !formData.province || !formData.district) {
      toast.error('All fields are required');
      return;
    }

    if (!editingId && !pdfFile) {
      toast.error('PDF file is required');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('candidateName', formData.candidateName);
      form.append('candidateParty', formData.candidateParty);
      form.append('discraption', formData.discraption);
      form.append('electionDate', formData.electionDate);
      form.append('province', formData.province);
      form.append('district', formData.district);
      if (pdfFile) {
        form.append('file', pdfFile);
      }

      if (editingId) {
        await updateManifest(editingId, form);
        toast.success('Manifest updated successfully');
      } else {
        await createManifest(form);
        toast.success('Manifest created successfully');
      }

      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manifest: Manifest) => {
    setFormData({
      candidateName: manifest.candidateName,
      candidateParty: manifest.candidateParty,
      discraption: manifest.discraption,
      electionDate: new Date(manifest.electionDate).toISOString().split('T')[0],
      province: manifest.province._id,
      district: manifest.district._id,
    });
    setEditingId(manifest._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this manifest?')) return;

    try {
      await deleteManifest(id);
      toast.success('Manifest deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete manifest');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manifests Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Add New Manifest'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Manifest' : 'Create New Manifest'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate Party
                </label>
                <input
                  type="text"
                  value={formData.candidateParty}
                  onChange={(e) => setFormData({ ...formData, candidateParty: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Date
                </label>
                <input
                  type="date"
                  value={formData.electionDate}
                  onChange={(e) => setFormData({ ...formData, electionDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File {!editingId && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.discraption}
                onChange={(e) => setFormData({ ...formData, discraption: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingId ? 'Update Manifest' : 'Create Manifest'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Manifests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {manifests.map((manifest) => (
                <tr key={manifest._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {manifest.candidateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manifest.candidateParty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manifest.province?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {manifest.district?.district || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(manifest.electionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <a
                      href={manifest.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View PDF
                    </a>
                    <button
                      onClick={() => handleEdit(manifest)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(manifest._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {manifests.length === 0 && (
            <div className="text-center py-8 text-gray-500">No manifests found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManifestManagement;
