import { api } from 'src/boot/axios';
import { Game } from 'src/interfaces/game';
import { ResponseData } from 'src/interfaces/response';
import { Pagination } from 'src/interfaces/pagination';

const path = '/v1/games';

export const game_service = () => ({
  getGameTypes: async (): Promise<ResponseData<string[]>> => {
    const response = await api.get(`${path}/types/list`);
    return response.data;
  },

  getGames: async (pagination?: Pagination): Promise<ResponseData<Game[]>> => {
    const response = await api.get(path, { params: pagination });
    return response.data;
  },

  getGamesByProvider: async (providerId: number): Promise<ResponseData<Game[]>> => {
    const response = await api.get(`${path}/provider/${providerId}`);
    return response.data;
  },

  getGameById: async (id: number): Promise<ResponseData<Game | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createGame: async (gameData: Game): Promise<ResponseData<Game | null>> => {
    delete gameData.id;
    const response = await api.post(path, gameData);
    return response.data;
  },

  updateGame: async (id: number, gameData: Partial<Game>): Promise<ResponseData<Game | null>> => {
    delete gameData.id;
    const response = await api.put(`${path}/${id}`, gameData);
    return response.data;
  },

  deleteGame: async (id: number): Promise<ResponseData<Game | null>> => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});
