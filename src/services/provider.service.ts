import { api } from 'boot/axios';
import { ResponseData } from 'src/interfaces/response';
import { Provider } from 'src/interfaces/provider';

const path = '/v1/providers';

export const provider_service = () => ({
  getProviders: async (): Promise<ResponseData<Provider[]>> => {
    const response = await api.get(path);
    return response.data;
  },

  getProviderById: async (id: string): Promise<ResponseData<Provider | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createProvider: async (provider: Provider): Promise<ResponseData<Provider | null>> => {
    const response = await api.post(path, provider);
    return response.data;
  },

  updateProvider: async (id: string, provider: Provider): Promise<ResponseData<Provider | null>> => {
    const response = await api.put(`${path}/${id}`, provider);
    return response.data;
  },

  deleteProvider: async (id: string): Promise<ResponseData<Provider | null>> => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});
