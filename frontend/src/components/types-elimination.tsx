import {
  SingleEliminationBracket,
  SVGViewer,
  CommonTreeProps,
  SingleEliminationProps,
  Participant,
} from '@g-loot/react-tournament-brackets'
import { useWindowSize } from '@uidotdev/usehooks'
import '../style/StyleElimination.css'
import { getTournament } from '../controller/tournamentController'
import { useEffect, useState } from 'react'

export const SingleElimination: React.FC<SingleEliminationProps> = ({ id }) => {
  
  const size = useWindowSize()
  const finalWidth = (size.width ?? 0) * 2.5 / 3
  const finalHeight = (size.height ?? 0) * 2.5 / 3
  const [tournaments, setTournaments] = useState<any[]>([]); 

  const onMatchClickTest = (top: Participant): void => {
    alert(`Match clicked: ${top.name} ${top.id}`);
  }

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getTournament(id);
        setTournaments(data);
      } catch (err) {
        console.error('Fehler beim Laden der Turniere:', err);
      }
    };
    fetchTournaments();
  }, [id]);

  return (
    <div className='elimination-wrapper'>
      {tournaments.length > 0 ? (
        <SingleEliminationBracket
          matches={tournaments}
          matchComponent={(props) => (
            <div
              className='bracket-match'
            >
              <div
                 className='top-party'
                 onClick={() => onMatchClickTest(props.topParty)}
              >
                <div className='party-name'>{props.topParty.name || props.teamNameFallback}</div>
                <div className='party-count'>{props.topParty.resultText ?? props.resultFallback(props.topParty)}</div>
              </div>
              <div
                className='middle-party'
              />
              <div
                onClick={() => onMatchClickTest(props.bottomParty)}
                className='bottom-party'
              >
                <div className='party-name'>{props.bottomParty.name || props.teamNameFallback}</div>
                <div className='party-count'>{props.bottomParty.resultText ?? props.resultFallback(props.bottomParty)}</div>
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
        <div className='loading'>Loading...</div>
      )}
    </div>
  );
};