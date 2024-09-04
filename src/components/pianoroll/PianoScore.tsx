import { useRef } from "react";
import { Rnd } from "react-rnd";
import { ChannelDefinition, PatternDefinition } from "../../models/models";
import { PIANO_KEY_HEIGHT } from "./consts";

export const PianoScore = ({channel, height, pixelsPerBeat, steps} : {pattern : PatternDefinition, channel : ChannelDefinition, height: number, pixelsPerBeat : number, steps : number}) => {

    const gridRef = useRef(null);

    return (
        <>
            <div style={{position: 'relative', height: height}}>
                <svg ref={gridRef} height={height} width={pixelsPerBeat/4*steps+1}>
                    <defs>
                        <pattern id="qbeat" width={pixelsPerBeat/4} height={PIANO_KEY_HEIGHT+1} patternUnits="userSpaceOnUse">
                            <path d={`M ${pixelsPerBeat/4} 0 L 0 0 0 ${PIANO_KEY_HEIGHT+1}`} fill="none" stroke="lightgray" strokeWidth="0.5" />
                        </pattern>
                        <pattern id="beat" width={pixelsPerBeat} height={PIANO_KEY_HEIGHT+1} patternUnits="userSpaceOnUse">
                            <rect width={pixelsPerBeat} height={PIANO_KEY_HEIGHT} fill="url(#qbeat)" />
                            <path d={`M ${pixelsPerBeat} 0 L 0 0 0 ${PIANO_KEY_HEIGHT+1}`} fill="none" stroke="#555" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width={steps*pixelsPerBeat/4+1} height="100%" fill="url(#beat)" />
                </svg>
                {gridRef.current && channel.checkpoints?.map((_cp, i)=>(
                    <Rnd size={{width: pixelsPerBeat/4, height: PIANO_KEY_HEIGHT}} enableResizing={false} dragGrid={[pixelsPerBeat/4, PIANO_KEY_HEIGHT+1]} bounds="parent" key={i}>
                        <div style={{height: PIANO_KEY_HEIGHT, width: pixelsPerBeat/4, backgroundColor: 'green'}}>note</div>
                    </Rnd>
                ))}
            </div>
        </>
    )
}
