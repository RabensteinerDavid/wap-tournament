import { Tournament } from '@g-loot/react-tournament-brackets'
import api from '../service/axiosInstance'

export const getTournamentBracket = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get(`/tournament/${id}`)
    return response.data.brackets
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const getTournamentGroups = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get<Tournament>(`/tournament/${id}`)
    if (response.data && response.data.groups) {
      console.log('Turnier gefunden:', response.data.title);  // Gibt den Titel des Turniers aus
      console.log('Gruppen:', response.data.groups); // Gibt die Gruppen aus
    return response.data.groups
    } else {
      console.log('Keine Gruppen im Turnier gefunden.');
      return [];
    }
    
  } catch (error) {
    console.error('Fehler beim Abruf der Turniergruppen: ', error);
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
    const response = await api.delete(`/tournament/${id}`)
    if (response.data.error) {
      return response.data
    } else {
      return { error: 'false', message: 'Tournament deleted successfully' }
    }
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}
