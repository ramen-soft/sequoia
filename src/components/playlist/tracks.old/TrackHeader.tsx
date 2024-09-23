import { TrackDefinition } from '../../../models/models';
import styles from './Track.module.css';
export const TrackHeader = ({track} : {track: TrackDefinition}) => {
    return (
    <div className={styles['track-wrapper']}>{track.name} </div>
    )
}
