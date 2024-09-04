import { useContext, useRef } from "react";
import { Rnd } from "react-rnd";
import { ChannelDefinition, PatternDefinition } from "../../models/models";
import { PIANO_KEY_HEIGHT } from "./consts";
import { freqToPos, keyFreq } from "../../lib/helpers/note-functions";
import { ProjectContext } from "../../context/ProjectContext";

export const PianoScore = ({channel, height, pixelsPerBeat, steps, totalNotes} : {pattern : PatternDefinition, channel : ChannelDefinition, height: number, pixelsPerBeat : number, steps : number, totalNotes: number}) => {

    const {project,setProject} = useContext(ProjectContext);

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
                    console.log(_cp);
                    return (
                        <Rnd position={{x: (pixelsPerBeat/4)*_cp.step, y:freqToPos(_cp.note)*PIANO_KEY_HEIGHT}} size={{width: pixelsPerBeat/4, height: PIANO_KEY_HEIGHT}} enableResizing={false} dragGrid={[pixelsPerBeat/4, PIANO_KEY_HEIGHT+1]} bounds="parent" key={i}>
                            <div style={{height: PIANO_KEY_HEIGHT, width: pixelsPerBeat/4, backgroundColor: 'green'}}>{freqToPos(_cp.note)}</div>
                        </Rnd>
                    )
                })}
            </div>
        </>
    )
}
