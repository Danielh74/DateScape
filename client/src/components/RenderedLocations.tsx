import { DateLocation } from '../models/DateLocation'
import LocationCard from './LocationCard'

type Props = {
    locations: DateLocation[],
    startIndex: number,
    endIndex: number
}

const RenderedLocations = ({ locations, startIndex, endIndex }: Props) => {
    return (
        <div className="row ">
            {locations.slice(startIndex, endIndex).map(location =>
                <LocationCard key={location.id} location={location} />
            )}
        </div>
    )
}

export default RenderedLocations