/**
 * Devuelve los milisegundos que dura una negra (quarter) para el BPM pasado por parametro
 */
const millisPerBeat = (bpm: number) => {
    return Math.floor(60000/bpm)
}

const stepToMillis = (bpm: number, step: number) => {
    return Math.floor(((60000/bpm)/4)*step);
}

const millisToStep = (bpm: number, millis: number) => {
    return Math.floor(millis/(60000/bpm))
}

export {millisPerBeat, stepToMillis, millisToStep}