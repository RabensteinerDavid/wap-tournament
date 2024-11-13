import { Tournament } from '@g-loot/react-tournament-brackets'
import api from '../service/axiosInstance'
import axios from 'axios'

export const getTournament = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get(`/tournament/${id}`)
    return response.data.brackets
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const getTournamentsByID = async (userID: string): Promise<Tournament[]> => {
  try {
    const response = await api.get(`/tournaments`)
    const filteredTournaments = response.data.filter(
      (tournament: Tournament) => tournament.userId === userID
    )
    return filteredTournaments
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const deleteTournamentsByID = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/tournament/${id}`);
    if (!response.data.error) {
      return { error: false, message: 'Tournament deleted successfully' };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { error: true, message: error.response.data?.error || 'An error occurred' };
    }
    return { error: true, message: 'An unexpected error occurred' };
  }
};
