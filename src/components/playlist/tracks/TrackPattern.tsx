import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { PatternDefinition } from "../../../models/models"
import styles from './TrackEditor.module.css'
import { calcPatternBounds, mapNotesToFrequencies, normalizedFrequencies } from "./patternFunctions";



export const TrackPattern = (props : PropsWithChildren<{pixelsPerMs: number, pattern: PatternDefinition}>) => {

    const [ctx, setCtx] = useState<CanvasRenderingContext2D|null|undefined>(null);
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const [values, setValues] = useState({bounds: {start: 0, width: 0, end: 0}, freqRange: {}, normalized: {}})

    let bounds, freqRange, normalized;
    useEffect(()=>{
        const bounds = calcPatternBounds(props.pattern, props.pixelsPerMs);
        const freqRange = mapNotesToFrequencies(props.pattern);
        const normalized = normalizedFrequencies(props.pattern, freqRange);
        setValues({bounds, freqRange, normalized});
    }, [props.pattern, props.pixelsPerMs]);

    return (
        <div className={`${styles['trackPattern']} ${styles['timeline-track-item']}`} style={{left: values.bounds.start, width: values.bounds.width}}>
        <canvas height="32" ref={canvasRef}></canvas>
        { JSON.stringify(values) }
        </div>
    )
}
