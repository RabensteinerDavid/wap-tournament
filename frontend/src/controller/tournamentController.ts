import api from '../service/axiosInstance';

export const getTournament = async (id: string): Promise<any[]> => {  
  try {
    const response = await api.get(`/tournament/${id}`);
    return response.data.brackets;  
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error);
    throw error;  
  }
};