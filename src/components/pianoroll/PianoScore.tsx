import { DraggableData, Rnd } from "react-rnd";
import { ChannelDefinition, PatternDefinition } from "../../models/models";
import { PIANO_KEY_HEIGHT } from "./consts";
import { freqToPos, keyFreq } from "../../lib/helpers/note-functions";
import { useProjectStore } from "../../states/ProjectState";

export const PianoScore = ({pattern, channel, height, pixelsPerBeat, steps, totalNotes} : {pattern : PatternDefinition, channel : ChannelDefinition, height: number, pixelsPerBeat : number, steps : number, totalNotes: number}) => {

    const project = useProjectStore();

    const handleDragStop = (evt: Event, drag: DraggableData, index: number) => {
        const key = 1+totalNotes-Math.round(drag.lastY/PIANO_KEY_HEIGHT);
        const freq = keyFreq(key);
        const cp = channel.checkpoints![index];
        project.setChannelNote(pattern, channel, index, {...cp, ...{note: freq}})
        
    }
    /*
    const updateNote = (cpIndex, yPos)=>{
        let pos = 1+(totalNotes-Math.round(yPos/24));
        console.log('e',pos);
        const freq = keyFreq(pos);
        console.log('f',freq);
        const patterns = structuredClone(project.patterns);
        const pat = patterns.find(p=>p.channels.find(c=>c.name==channel.name));
        const chan = pat?.channels.find(c=>c.name===channel.name)
        chan.checkpoints[cpIndex].note = freq;
        const newProject = {...project, ...{patterns: patterns}}
        setProject(newProject);
    }
    */

    return (
        <>
            <div style={{position: 'relative', height: height}}>
                <svg height={height} width={pixelsPerBeat/4*steps+1}>
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
                {channel.checkpoints?.map((_cp, i)=>{
                    const y = 1+(totalNotes-freqToPos(_cp.note)-1)*(PIANO_KEY_HEIGHT+1)
                    return (
                        <Rnd onDragStop={(event, data)=>handleDragStop(event, data, i)} position={{x: (pixelsPerBeat/4)*_cp.step, y}} size={{width: pixelsPerBeat/4, height: PIANO_KEY_HEIGHT}} enableResizing={false} dragGrid={[pixelsPerBeat/4, PIANO_KEY_HEIGHT+1]} bounds="parent" key={i}>
                            <div style={{height: PIANO_KEY_HEIGHT, width: pixelsPerBeat/4, backgroundColor: 'green'}}>{freqToPos(_cp.note)}</div>
                        </Rnd>
                    )
                })}
            </div>
        </>
    )
}
