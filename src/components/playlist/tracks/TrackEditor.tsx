import { useProjectStore } from "../../../states/ProjectState"
import { Track } from "./Track"
import styles from './TrackEditor.module.css'

export const TrackEditor = ({pixelsPerBeat} : {pixelsPerBeat: number}) => {
    const project = useProjectStore()
    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <pattern id="tqbeat" width={pixelsPerBeat/4} height="32" patternUnits="userSpaceOnUse">
                        <path d={`M ${pixelsPerBeat/4} 0 L 0 0 0 32`} fill="none" stroke="lightgray" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="tbeat" width={pixelsPerBeat} height="32" patternUnits="userSpaceOnUse">
                        <rect width={pixelsPerBeat} height="32" fill="url(#tqbeat)" />
                        <path d={`M ${pixelsPerBeat} 0 L 0 0 0 32`} fill="none" stroke="#555" strokeWidth="1" />
                    </pattern>
                </defs>
            </svg>
            <div className={styles.tracklist}>
                { project.tracks.map(track => <Track pixelsPerBeat={pixelsPerBeat} key={track.id} track={track} />) }
            </div>
        </>
    )
}
