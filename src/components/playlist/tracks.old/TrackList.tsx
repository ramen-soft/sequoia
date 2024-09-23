import { useProjectStore } from "../../../states/ProjectState"
import { TrackHeader } from "./TrackHeader";
import styles from './Track.module.css';
import { TrackDefinition } from "../../../models/models";
import { v4 as uuid } from 'uuid'
import { SQButton } from "../../ui/SQButton";

export const TrackList = () => {
    const project = useProjectStore();
    const { tracks } = project;

    const addTrack = () => {
        const td : TrackDefinition = {
            id: uuid(),
            name: `Track ${(tracks.length+1).toString().padStart(2, '0')}`,
            patterns: [],
        }
        project.addTrack(td);
    }

    return (
        <div className={styles['track-list']}>
            <div className={styles['tracks']}>
                { tracks.map((track, i) => <TrackHeader key={i} track={track} />) }
            </div>
            <div className={styles['track-list-actions']}>
                <SQButton onClick={()=>addTrack()}>+ Track</SQButton>
            </div>
        </div>
    )
}
