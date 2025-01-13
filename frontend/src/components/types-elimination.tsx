import {
  SingleEliminationBracket,
  SVGViewer,
  CommonTreeProps,
  SingleEliminationProps,
  Match
} from '@g-loot/react-tournament-brackets'
import { useWindowSize } from '@uidotdev/usehooks'
import '../style/StyleElimination.css'
import { getTournamentBracket } from '../controller/tournamentController'
import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import loadingAnimation from '../assets/loading.json'

export const SingleElimination: React.FC<SingleEliminationProps> = ({
  id,
  reloadTrigger
}) => {
  const size = useWindowSize()
  const finalWidth = ((size.width ?? 0) * 2.5) / 4
  const finalHeight = ((size.height ?? 0) * 2.5) / 4
  const [tournaments, setTournaments] = useState<Match[]>([])

  useEffect(() => {
    if (!id) {
      console.error('Keine Turnier-ID vorhanden!')
      return
    }

    const fetchTournaments = async () => {
      try {
        const data = await getTournamentBracket(id)
        setTournaments(data)
      } catch (err) {
        console.error('Fehler beim Laden der Turniere:', err)
      }
    }
    fetchTournaments()
  }, [id, reloadTrigger])

  return (
    <div className='elimination-wrapper'>
      {tournaments.length > 0 ? (
        <SingleEliminationBracket
          matches={tournaments}
          matchComponent={props => (
            <div className='bracket-match'>
              <div className='top-party'>
                <div className='party-name'>
                  {props.topParty.name || props.teamNameFallback}
                </div>
                <div className='party-count'>
                  {props.topParty.resultText ??
                    props.resultFallback(props.topParty)}
                </div>
              </div>
              <div className='middle-party' />
              <div className='bottom-party'>
                <div className='party-name'>
                  {props.bottomParty.name || props.teamNameFallback}
                </div>
                <div className='party-count'>
                  {props.bottomParty.resultText ??
                    props.resultFallback(props.bottomParty)}
                </div>
              </div>
            </div>
          )}
          svgWrapper={({ children, ...props }: CommonTreeProps) => (
            <SVGViewer
              width={finalWidth}
              height={finalHeight}
              bracketWidth={finalWidth}
              bracketHeight={finalHeight}
              startAt={[0, 0]}
              scaleFactor={1}
              {...props}
            >
              {children}
            </SVGViewer>
          )}
        />
      ) : (
        <div className='lottie-loading-wrapper'>
          <Lottie
            animationData={loadingAnimation}
            style={{ width: '40%' }}
            loop={true}
          />
        </div>
      )}
    </div>
  )
}