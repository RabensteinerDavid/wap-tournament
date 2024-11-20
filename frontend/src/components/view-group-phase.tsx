import { useParams } from "react-router-dom";
import { GroupPhase } from "./types-groups";

const viewGroups = () => {
    
    const { id } = useParams();

    return (
        <div className='view-group-phase-wrapper'>
            <h1>View Group Phase</h1>
            <GroupPhase id={id} />
        </div>
    )
}

export default viewGroups