import { useState } from "react"
import { PIXELS_PER_BEAT } from "../pianoroll/consts"
import styles from './PlayList.module.css'
import { PatternList } from "./patterns/list/PatternList";
import { Active, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { PatternListItem } from "./patterns/list/PatternListItem";
import { TrackEditor } from "./tracks/TrackEditor";
import { useProjectStore } from "../../states/ProjectState";
import { v4 as uuid } from 'uuid';

export const PlayList = () => {
    const project = useProjectStore();

    const [pixelsPerBeat, setPixelsPerBeat] = useState(PIXELS_PER_BEAT);

    const [draggingElement, setDraggingElement] = useState<Active|null>(null);

    const handlePixelsPerBeatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPixelsPerBeat(parseInt(event.currentTarget.value))
    }

    const handleDragStart = (event: DragStartEvent) => {
        console.log(event.active);
        setDraggingElement(event.active);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const instanceId = uuid();
        const trackId : string = event.over?.id as string;
        const patternId = event.active.data.current?.id;
        console.log(trackId, patternId);
        project.addPatternToTrack(instanceId, trackId, patternId);
        setDraggingElement(null);
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.playlist}>
            <div className={styles['playlist-tools']}>
                <input type="range" min="10" max="1000" value={pixelsPerBeat} onChange={handlePixelsPerBeatChange} />
            </div>
            <div className={styles['playlist-body']}>
                <PatternList />
                <TrackEditor pixelsPerBeat={pixelsPerBeat} />
                { /*
                <div className={styles['trackeditor']}>
                    <TrackList />
                    <TracksPane pixelsPerBeat={pixelsPerBeat} />
                </div>
                */}
            </div>
        </div>

        <DragOverlay>
            { draggingElement && draggingElement.data ? (
                <PatternListItem id={draggingElement.data.current?.id} name={draggingElement.data.current?.name} onClick={()=>{}}/>
            ) : null }
        </DragOverlay>
        </DndContext>
    )
}
