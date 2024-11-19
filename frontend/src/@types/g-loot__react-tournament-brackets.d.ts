declare module '@g-loot/react-tournament-brackets' {
  import { ReactElement, ReactNode } from 'react'

  export type Participant = {
    id: string | number
    isWinner?: boolean
    name?: string
    status?: 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | string | null
    resultText?: string | null
    [key: string]: any
  }

  export type Match = {
    id: number | string
    href?: string
    name?: string
    nextMatchId: number | string | null
    nextLooserMatchId?: number | string | null
    tournamentRoundText?: string
    startTime: string
    state: 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | string
    participants: Participant[]
    [key: string]: any
  }

  export interface SingleEliminationProps {
    id: string | undefined
  }

  export type Options = {
    width?: number
    boxHeight?: number
    canvasPadding?: number
    spaceBetweenColumns?: number
    spaceBetweenRows?: number
    connectorColor?: string
    connectorColorHighlight?: string
    roundHeader?: {
      isShown?: boolean
      height?: number
      marginBottom?: number
      fontSize?: number
      fontColor?: string
      backgroundColor?: string
      fontFamily?: string
      roundTextGenerator?: (
        currentRoundNumber: number,
        roundsTotalNumber: number
      ) => string | undefined
    }
    roundSeparatorWidth?: number
    lineInfo?: {
      separation?: number
      homeVisitorSpread?: number
    }
    horizontalOffset?: number
    wonBywalkOverText?: string
    lostByNoShowText?: string
  }

  export type ComputedOptions = Options & {
    rowHeight?: number
    columnWidth?: number
  }

  export type SvgViewerProps = {
    height: number
    width: number
    bracketWidth: number
    bracketHeight: number
    children?: ReactNode
    startAt: number[]
    scaleFactor: number
  }

  export type MatchComponentProps = {
    match: Match
    onMatchClickTest: (args: { top: Participant; bottom: Participant }) => void
    onMatchClick: (args: {
      match: Match
      topWon: boolean
      bottomWon: boolean
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    }) => void
    onPartyClick: (party: Participant, partyWon: boolean) => void
    onMouseEnter: (partyId: string | number) => void
    onMouseLeave: () => void
    topParty: Participant
    bottomParty: Participant
    topWon: boolean
    bottomWon: boolean
    topHovered: boolean
    bottomHovered: boolean
    topText: string
    bottomText: string
    connectorColor?: string
    computedStyles?: ComputedOptions
    teamNameFallback: string
    resultFallback: (participant: Participant) => string
  }

  export type Theme = {
    fontFamily: string
    transitionTimingFunction: string
    disabledColor: string
    roundHeaders: {
      background: string
    }
    matchBackground: {
      wonColor: string
      lostColor: string
    }
    border: {
      color: string
      highlightedColor: string
    }
    textColor: {
      highlighted: string
      main: string
      dark: string
      disabled: string
    }
    score: {
      text: {
        highlightedWonColor: string
        highlightedLostColor: string
      }
      background: {
        wonColor: string
        lostColor: string
      }
    }
    canvasBackground: string
  }

  export type CommonTreeProps = {
    svgWrapper?: (props: {
      bracketWidth: number
      bracketHeight: number
      startAt: number[]
      children: ReactElement
    }) => React.ReactElement
    theme?: Theme
    options?: { style: Options }
    children?: ReactNode
  }

  export type BracketLeaderboardProps = CommonTreeProps & {
    matchComponent: (props: MatchComponentProps) => JSX.Element
    currentRound?: string
    onMatchClick?: (args: {
      match: Match
      topWon: boolean
      bottomWon: boolean
    }) => void
    onPartyClick?: (party: Participant, partyWon: boolean) => void
  }

  export type SingleElimLeaderboardProps = BracketLeaderboardProps & {
    matches: Match[]
  }

  export type DoubleElimLeaderboardProps = BracketLeaderboardProps & {
    matches: { upper: Match[]; lower: Match[] }
  }

  export interface AuthContextType {
    isLoggedIn: boolean
    login: (
      email: string,
      password: string
    ) => Promise<{ success: boolean; message?: string }>
    signup: (
      username: string,
      email: string,
      password: string
    ) => Promise<{ success: boolean; message?: string }>
    logout: () => void
    getUser: () => Promise<{ success: boolean; data?: any; message?: string }>
  }

  type Props = { children: React.ReactNode }

  interface Tournament {
    _id: string
    title: string
    date: string
    groups: { [key: string]: any }[]
    isGroupPhaseDone: boolean
    participants: string[]
    userId: string
    winner: string | null
    brackets: any[]
  }

  interface DeleteModalProps {
    tournament_id: string
    tournament_title: string
    handleDeleteMessage: (message: DeleteResponse) => void
    openSnackbarDeleteMessage: () => void
  }

  interface EditModalProps {
    tournament_id: string
    tournament_title: string
  }

  interface DeleteResponse {
    error: boolean;
    message: string;
  }

  type CreateTournament = {
    title: string;
    participants: string[];
    date: string; 
  };

  export const SingleEliminationBracket: React.FC<SingleElimLeaderboardProps>
  export const DoubleEliminationBracket: React.FC<DoubleElimLeaderboardProps>
  export const Match: React.FC<MatchComponentProps>
  export const SVGViewer: React.FC<SvgViewerProps>
}
