import {
  CreateTournament,
  CreateTournamentResponse,
  DeleteTournamentResponse,
  Group,
  Match,
  Tournament
} from '@g-loot/react-tournament-brackets'
import api from '../service/axiosInstance'
import axios from 'axios'

export const getTournamentBracket = async (id: string): Promise<Match[]> => {
  try {
    const response = await api.get(`/tournament/${id}`)
    return response.data.brackets
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const getTournamentGroups = async (id: string): Promise<Group[]> => {
  try {
    const response = await api.get(`/tournament/${id}`)
    if (response.data && response.data.groups) {
      return response.data.groups
    } else {
      console.log('Keine Gruppen im Turnier gefunden.')
      return []
    }
  } catch (error) {
    console.error('Fehler beim Abruf der Turniergruppen: ', error)
    throw error
  }
}

export const getTournamentsByID = async (
  userID: string
): Promise<Tournament[]> => {
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

export const getAllTournaments = async (): Promise<Tournament[]> => {
  try {
    const response = await api.get(`/tournaments`)
    return response.data
  } catch (error) {
    console.error('Fehler beim Laden aller Turniere: ', error)
    throw error
  }
}

export const deleteTournamentsByID = async (
  id: string
): Promise<DeleteTournamentResponse> => {
  try {
    const response = await api.delete(`/tournament/${id}`)
    if (!response.data.error) {
      return { error: false, message: 'Tournament deleted successfully' }
    }
    return { error: true, message: 'An unknown error occurred' }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        error: true,
        message: error.response.data?.error || 'An error occurred'
      }
    }
    return { error: true, message: 'An unexpected error occurred' }
  }
}

export const createTournament = async (
  tournament: CreateTournament
): Promise<CreateTournamentResponse> => {
  try {
    const response = await api.post('/tournament', tournament)
    return {
      error: false,
      message: 'Tournament created successfully',
      tournamentID: response.data._id
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        error: true,
        message: error.response.data?.error || 'An error occurred'
      }
    }
    return { error: true, message: 'An unexpected error occurred' }
  }
}

export const getTournament = async (id: string): Promise<Tournament> => {
  try {
    const response = await api.get(`/tournament/${id}`)
    return response.data
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const updateTournament = async (
  id: string,
  title: string,
  participants: string[],
  date: string
): Promise<Tournament> => {
  try {
    const response = await api.put(`/tournament/${id}`, {
      title,
      participants,
      date
    })
    return response.data
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const changePointsParticipant = async (
  id: string,
  groupIndex: string,
  memberIndex: string,
  points: number
): Promise<Tournament> => {
  try {
    const response = await api.patch(
      `/tournament/${id}/addpoints/${groupIndex}/${memberIndex}`,
      {
        points
      }
    )
    return response.data
  } catch (error) {
    console.error('Fehler beim Laden der Turniere:', error)
    throw error
  }
}

export const finishGroupPhase = async (
  id?: string
): Promise<{ success: boolean; message?: string }> => {
  if (!id) {
    return { success: false, message: 'Keine ID für das Turnier angegeben' }
  }
  try {
    await api.patch(`/tournament/${id}/finishgroup`)
    return { success: true }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.error }
    }
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export const setWinnerBracket = async (
  id: string,
  bracketID: string,
  winnerID: string,
  pointsWinner: number,
  pointsLoser: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.patch(
      `/tournament/${id}/bracket/${bracketID}/winner/${winnerID}`,
      {
        pointsWinner,
        pointsLoser
      }
    )
    return { success: true }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.error }
    }
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export const resetWinnerBracket = async (
  id: string,
  bracketID: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    await api.patch(`/tournament/${id}/bracket/${bracketID}/resetwinners`)
    return { success: true }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.error }
    }
    return { success: false, message: 'An unexpected error occurred' }
  }
}
