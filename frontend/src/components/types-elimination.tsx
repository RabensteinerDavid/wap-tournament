import {
  SingleEliminationBracket,
  DoubleEliminationBracket,
  Match,
  SVGViewer,
} from '@g-loot/react-tournament-brackets'
import simpleDoubleFull from '../data/simple-data'
import { useWindowSize } from '@uidotdev/usehooks'
import { ReactNode } from 'react'
import '../style/StyleElimination.css'
import simpleSmallBracket from '../data/simple-small-bracket'

interface Props {
  children?: ReactNode
}  

export const SingleElimination = () => {
  const size = useWindowSize()
  const finalWidth = (size.width ?? 0) * 2.5/3
  const finalHeight = (size.height ?? 0) * 2.5/3
  return (
    <SingleEliminationBracket
    matches={simpleSmallBracket}
    matchComponent={Match}
    svgWrapper={({ children, ...props }: Props) => (
      <SVGViewer width={finalWidth} height={finalHeight} {...props}>
        {children}
      </SVGViewer>
    )}
  />
  )
}

export const DoubleElimination = () => {
  const size = useWindowSize()
  const finalWidth = (size.width ?? 0) * 2.5/3
  const finalHeight = (size.height ?? 0) * 2.5/3
  return (
    <DoubleEliminationBracket
      matches={simpleDoubleFull}
      matchComponent={Match}
      svgWrapper={({ children, ...props }: Props) => (
        <SVGViewer width={finalWidth} height={finalHeight} {...props}>
          {children}
        </SVGViewer>
      )}
    />
  )
}