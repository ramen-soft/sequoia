import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { PatternDefinition } from "../../../models/models";
import styles from "./TrackEditor.module.css";
import {
    calcPatternBounds,
    mapNotesToFrequencies,
    normalizeFrequency,
} from "./patternFunctions";

export const TrackPattern = (
    props: PropsWithChildren<{
        pixelsPerMs: number;
        pattern: PatternDefinition;
    }>
) => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(
        null
    );
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [values, setValues] = useState<{
        bounds: { start: number; width: number; end: number };
        freqRange: { min: number; max: number };
    }>({
        bounds: { start: 0, width: 0, end: 0 },
        freqRange: { min: 0, max: 0 },
    });

    useEffect(() => {
        setCtx(canvasRef.current?.getContext("2d"));
    }, []);

    useEffect(() => {
        if (ctx && canvasRef.current) {
            ctx.canvas.width = values.bounds.width;
            ctx.fillStyle = "#000";
            ctx.fillRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );
            ctx.strokeStyle = "red";

            props.pattern.channels.map((channel) =>
                channel.checkpoints?.forEach((cp) => {
                    const x = cp.time.start * props.pixelsPerMs;
                    const w =
                        (cp.time.start + (cp.time.duration - cp.time.start)) *
                        props.pixelsPerMs;
                    const y =
                        ctx.canvas.height *
                        (normalizeFrequency(cp.note, values.freqRange) ?? 0);
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y);
                    ctx.stroke();
                })
            );
        }
    }, [props.pattern, props.pixelsPerMs, values, ctx]);

    useEffect(() => {
        const bounds = calcPatternBounds(props.pattern, props.pixelsPerMs);
        const freqRange = mapNotesToFrequencies(props.pattern);
        console.log(freqRange);
        setValues({ bounds, freqRange });
    }, [props.pattern, props.pixelsPerMs]);

    return (
        <div
            className={`${styles["trackPattern"]} ${styles["timeline-track-item"]}`}
            style={{ left: values.bounds.start, width: values.bounds.width }}
        >
            <canvas height="32" ref={canvasRef}></canvas>
            {JSON.stringify(values)}
        </div>
    );
};
