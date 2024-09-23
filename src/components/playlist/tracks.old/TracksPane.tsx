import { useState } from "react"
import { useProjectStore } from "../../../states/ProjectState"
import { STEPS_PER_BEAT } from "../../pianoroll/consts"
import styles from './Track.module.css'
import { Rnd } from "react-rnd"
import { TrackDefinition } from "../../../models/models"
import { TrackItem } from "./TrackItem"

export const TracksPane = ({pixelsPerBeat}: {pixelsPerBeat: number}) => {

    const project = useProjectStore()
    const pixelsPerMs = pixelsPerBeat/(60000/project.bpm)
    const {tracks} = project;
    const setEditingTrack = useState<TrackDefinition|null>(null)[1]

    const handleTrackEdit = (track: TrackDefinition)=>setEditingTrack(track)

    return (
        <div className={styles['track-pane-wrapper']}>
            <div className={styles['track-pane']}>
                <svg width="100%" height="100%">
                    <defs>
                        <pattern id="tqbeat" width={pixelsPerBeat/4} height="32" patternUnits="userSpaceOnUse">
                            <path d={`M ${pixelsPerBeat/4} 0 L 0 0 0 32`} fill="none" stroke="lightgray" strokeWidth="0.5" />
                        </pattern>
                        <pattern id="tbeat" width={pixelsPerBeat} height="32" patternUnits="userSpaceOnUse">
                            <rect width={pixelsPerBeat} height="32" fill="url(#tqbeat)" />
                            <path d={`M ${pixelsPerBeat} 0 L 0 0 0 32`} fill="none" stroke="#555" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#tbeat)" />
                </svg>
                { tracks.map((track, i) => (
                    <Rnd position={{x: 0, y: 32*i}} dragGrid={[pixelsPerBeat/STEPS_PER_BEAT, 1]} dragAxis="x" key={i}>
                        <TrackItem onTrackDblClick={()=>handleTrackEdit(track)} trackInfo={track} pixelsPerMs={pixelsPerMs} />
                    </Rnd>
                ))}
            </div>

            {/*editingTrack && <TrackEditor track={editingTrack} /> */}
        </div>
    )
}
