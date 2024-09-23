import { stepToMillis } from "../../../lib/helpers/time-functions";
import { PatternDefinition } from "../../../models/models";

const calcPatternBounds = (pattern: PatternDefinition, pixelsPerMs: number) => {
    console.log(pattern, pixelsPerMs);
    const start = 0;
    const width = stepToMillis(96, pattern.steps) * pixelsPerMs;
    const end = width;

    return {
        start: start * pixelsPerMs,
        end: end * pixelsPerMs,
        width: width,
    };
};

const mapNotesToFrequencies = (pattern: PatternDefinition) => {
    let downFreq = 20000;
    pattern.channels.forEach((chan) => {
        chan.checkpoints.forEach((cp) => {
            downFreq = Math.min(downFreq, cp.note);
        });
    });
    let topFreq = -20000;
    pattern.channels.forEach((chan) => {
        chan.checkpoints.forEach((cp) => {
            topFreq = Math.max(topFreq, cp.note);
        });
    });

    return { min: downFreq, max: topFreq };
};

const normalizeFrequency = (
    freq: number,
    range: { min: number; max: number }
) => {
    const r = range.max - range.min + 1e-8 + 20;
    return 1 - (freq - range.min + 10) / r;
};

export { calcPatternBounds, mapNotesToFrequencies, normalizeFrequency };
