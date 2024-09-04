import styles from './PianoRoll.module.css'
import { PIANO_KEY_HEIGHT, PIANO_KEY_WIDTH } from './consts'

export const PianoKey = ({y, type, keyPos, label, onKey} : {y: number, type: 'black'|'white', keyPos: number, label:string, onKey : (keyPos: number | null)=>void}) => {

    const handleKeyClick = (event : React.MouseEvent<SVGElement>) => {
        if(event.buttons == 1){
            onKey(keyPos)
        }
    }

    const width = type == "white" ? PIANO_KEY_WIDTH : PIANO_KEY_WIDTH - 20;
    const height = type == "white" ? PIANO_KEY_HEIGHT : PIANO_KEY_HEIGHT / 2;
    const fillColor = type == "white" ? '#fff' : '#555';

    return (
        <>
            <g className={`${styles.keys} ${styles[type]}`} onMouseDown={handleKeyClick} onMouseMove={handleKeyClick}>
                <rect y={y} width={width} height={height} fill={fillColor}></rect>
                {type=="white" && <text x={PIANO_KEY_WIDTH-15} y={17 + y}>{label}</text>}
            </g>
        </>
    )
}
