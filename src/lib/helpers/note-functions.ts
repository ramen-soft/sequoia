import { roundTo } from "./util";

const noteToFreq = (note: string, octave : number) => {
    const basePos : {[name:string]:number} = {'C': 40, 'C#': 41, 'D': 42, 'D#': 43, 'E': 44, 'F': 45, 'F#': 46, 
        'G': 47, 'G#': 48, 'A': 49, 'A#': 50, 'B': 51}
    
    const pos = basePos[note] + (octave - 4) * 12;

    return roundTo(440 * Math.pow(2, ((pos - 49) / 12)),3);
}

const posIsBlackKey = (pos : number) : boolean => {
    const mod = pos%12;
    return [1, 3, 6, 8, 10].includes(mod)
}

const KEY_LABELS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

const keyLabel = (pos:number) : string => {
    const octave = Math.floor(pos/12);
    return KEY_LABELS[pos%12] + octave;
}

const keyFreq = (pos:number) => {
    return noteToFreq(KEY_LABELS[pos%12], Math.floor(pos/12));
}

export {noteToFreq, posIsBlackKey, KEY_LABELS, keyLabel, keyFreq}