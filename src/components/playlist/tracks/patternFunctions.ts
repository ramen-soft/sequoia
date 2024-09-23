import { stepToMillis } from "../../../lib/helpers/time-functions";
import {
    ChannelDefinition,
    Checkpoint,
    PatternDefinition,
} from "../../../models/models";

const calcPatternBounds = (pattern: PatternDefinition, pixelsPerMs: number) => {
    console.log(pattern, pixelsPerMs);
    const start = 0;
    const width = stepToMillis(96, pattern.steps) * pixelsPerMs;
    const end = width;
    /*
    const min = pattern.channels.reduce((x: number, chan: ChannelDefinition) => Math.min(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.min(c, note.time.start), 999999), 999999), 9999999) || 0;
    const max = pattern.channels.reduce((x: number, chan: ChannelDefinition) => Math.max(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.max(c, note.time.end), min), min), min) || 0;
    const start = pattern.channels.reduce((x: number, chan: ChannelDefinition) => Math.min(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.min(c, note.time.start), max), max), max) || 0;
    const end = pattern.channels.reduce((x: number, chan: ChannelDefinition) => Math.max(chan.checkpoints.reduce((c: number, note: Checkpoint)=>Math.max(c, note.time.start), min), min), min) || 0;
    */
    return {
        start: start * pixelsPerMs,
        end: end * pixelsPerMs,
        width: width,
    };
};

const mapNotesToFrequencies = (pattern: PatternDefinition) => {
    const minFreq = pattern.channels.reduce(
        (x: number, chan: ChannelDefinition) =>
            Math.min(
                chan.checkpoints.reduce(
                    (c: number, note: Checkpoint) => Math.min(c, note.note),
                    20000
                ),
                20000
            ),
        20000
    );
    const maxFreq = pattern.channels.reduce(
        (x: number, chan: ChannelDefinition) =>
            Math.max(
                chan.checkpoints.reduce(
                    (c: number, note: Checkpoint) => Math.max(c, note.note),
                    minFreq
                ),
                minFreq
            ),
        minFreq
    );
    return { min: minFreq, max: maxFreq };
};

const normalizedFrequencies = (
    pattern: PatternDefinition,
    range: { min: number; max: number }
) => {
    const r = range.max - range.min + 1e-8 + 20;
    const normalized = pattern.channels
        .map((chan) =>
            chan.checkpoints?.map((cp) => 1 - (cp.note - range.min + 10) / r)
        )
        .flat();
    return normalized;
};

export { calcPatternBounds, mapNotesToFrequencies, normalizedFrequencies };
