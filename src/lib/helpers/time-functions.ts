/**
 * Devuelve los milisegundos que dura una negra (quarter) para el BPM pasado por parametro
 */
const millisPerBeat = (bpm: number) => {
    return Math.floor(60000/bpm)
}

const stepToMillis = (bpm: number, step: number) => {
    return Math.floor(((60000/bpm)/4)*step);
}

export {millisPerBeat, stepToMillis}