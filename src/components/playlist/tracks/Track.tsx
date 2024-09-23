import { useDroppable } from "@dnd-kit/core"
import { TrackDefinition } from "../../../models/models"
import styles from './TrackEditor.module.css'
import { useProjectStore } from "../../../states/ProjectState"
import { TrackPattern } from "./TrackPattern"

export const Track = ({ pixelsPerBeat, track } : { pixelsPerBeat: number, track:TrackDefinition }) => {

    const project = useProjectStore()
    const pixelsPerMs = pixelsPerBeat/(60000/project.bpm)
    const {patterns} = project;
    const {setNodeRef, isOver} = useDroppable({
        id: track.id
    })

    return (
        <div className={styles.track}>
            <div className={styles.trackhead}>
                {track.name}
            </div>
            <div className={styles.timeline} ref={setNodeRef}>
                <svg width="100%" height="100%">
                    <rect width="100%" height="100%" fill="url(#tbeat)" />
                </svg>
                { track.patterns.map(pattern=>{
                    const pat = patterns.find(p=>p.id===pattern.id);
                    if(pat){ return <TrackPattern key={pattern.instanceId} pixelsPerMs={pixelsPerMs} pattern={pat} /> }
                }) }
                { JSON.stringify(track.patterns) }
            </div>
        </div>
    )
}
