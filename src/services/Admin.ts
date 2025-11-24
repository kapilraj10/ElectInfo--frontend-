import axios from 'axios';

const API_URL = 'https://elect-info-backend.vercel.app/api/v1/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Province APIs
export interface Province {
  _id: string;
  name: string;
}

export const createProvince = async (province: string) => {
  const response = await axios.post(
    `${API_URL}/province`,
    { province },
    getAuthHeaders()
  );
  return response.data;
};

export const getProvinces = async (): Promise<{ success: boolean; provinces: Province[] }> => {
  const response = await axios.get(`${API_URL}/provinces`);
  return response.data;
};

export const deleteProvince = async (id: string) => {
  const response = await axios.delete(`${API_URL}/province/${id}`, getAuthHeaders());
  return response.data;
};

// District APIs
export interface District {
  _id: string;
  district: string;
}

export const createDistrict = async (district: string) => {
  const response = await axios.post(
    `${API_URL}/district`,
    { district },
    getAuthHeaders()
  );
  return response.data;
};

export const getDistricts = async (): Promise<{ success: boolean; districts: District[] }> => {
  const response = await axios.get(`${API_URL}/districts`);
  return response.data;
};

export const deleteDistrict = async (id: string) => {
  const response = await axios.delete(`${API_URL}/district/${id}`, getAuthHeaders());
  return response.data;
};

// Manifest APIs
export interface Manifest {
  _id: string;
  candidateName: string;
  candidateParty: string;
  discraption: string;
  pdfUrl: string;
  electionDate: string;
  province: Province;
  district: District;
}

export const createManifest = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/manifest`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getManifests = async (): Promise<{ success: boolean; manifests: Manifest[] }> => {
  const response = await axios.get(`${API_URL}/manifests`);
  return response.data;
};

export const deleteManifest = async (id: string) => {
  const response = await axios.delete(`${API_URL}/manifest/${id}`, getAuthHeaders());
  return response.data;
};

export const updateManifest = async (id: string, formData: FormData) => {
  const response = await axios.put(`${API_URL}/manifest/${id}`, formData, {
    ...getAuthHeaders(),
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
