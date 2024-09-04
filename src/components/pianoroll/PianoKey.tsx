import { posIsBlackKey } from '../../lib/helpers/note-functions';
import styles from './PianoRoll.module.css'
import { PIANO_KEY_HEIGHT, PIANO_KEY_WIDTH, PIXELS_PER_BEAT } from "./consts";

export const PianoKey = (
        {y, type, keyPos, label, onKey}
    :   {y: number, type: 'black'|'white', keyPos: number, label:string, onKey : (keyPos: number | null)=>void}
) => {
    const width = type === "white" ? PIANO_KEY_WIDTH : PIANO_KEY_WIDTH - 20;
    const height = type === "white" ? PIANO_KEY_HEIGHT : PIANO_KEY_HEIGHT;
    const fillColor = type === "white" ? "#fff" : "#555";

    const isBlackKey = type !== "white";
    const nextKeyIsBlack = posIsBlackKey(keyPos-1);
    const prevKeyIsBlack = posIsBlackKey(keyPos+1);
    const betweenBlacks = !isBlackKey && nextKeyIsBlack && prevKeyIsBlack;

    const handleKeyClick = (event : React.MouseEvent<SVGElement>) => {
        if(event.buttons == 1){
            onKey(keyPos)
        }
    }

    return (
        <>
            <g className={`${styles.keys} ${styles[type]}`} onMouseDown={handleKeyClick} onMouseMove={handleKeyClick}>
                { betweenBlacks && <path d={`M0,${y} L${PIANO_KEY_WIDTH-20},${y} L${PIANO_KEY_WIDTH-20},${y-10} L${PIANO_KEY_WIDTH},${y-10} L${PIANO_KEY_WIDTH},${y+PIANO_KEY_HEIGHT+15} L${PIANO_KEY_WIDTH-20},${y+PIANO_KEY_HEIGHT+15} L${PIANO_KEY_WIDTH-20},${y+PIANO_KEY_HEIGHT} L0,${y+PIANO_KEY_HEIGHT} Z`} fill={fillColor} />}
                
                {
                    (!betweenBlacks && nextKeyIsBlack) && <path d={`M0,${y} L${PIANO_KEY_WIDTH},${y} L${PIANO_KEY_WIDTH},${y+PIANO_KEY_HEIGHT+15} L${PIANO_KEY_WIDTH-20},${y+PIANO_KEY_HEIGHT+15} L${PIANO_KEY_WIDTH-20},${y+PIANO_KEY_HEIGHT}, L0,${y+PIANO_KEY_HEIGHT} Z`} fill="#fff" />
                }

                {
                    (!betweenBlacks && prevKeyIsBlack) && <path d={`M0,${y} L${PIANO_KEY_WIDTH-20},${y} L${PIANO_KEY_WIDTH-20},${y-15} L${PIANO_KEY_WIDTH},${y-15} L${PIANO_KEY_WIDTH},${y+PIANO_KEY_HEIGHT}, L0,${y+PIANO_KEY_HEIGHT} Z`} fill="#fff" />
                }
                {
                    (isBlackKey) && <rect y={y} width={width} height={height} fill={fillColor}></rect>
                }
                
                {type==="white" && <text x={PIANO_KEY_WIDTH-35} y={y+17}>{keyPos} {label}</text>}
            </g>
        </>
    )
}
