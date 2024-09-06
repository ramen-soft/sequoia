import { DraggableData, Rnd } from "react-rnd";
import { ChannelDefinition, PatternDefinition } from "../../models/models";
import { PIANO_KEY_HEIGHT, STEPS_PER_BEAT } from "./consts";
import { freqToPos, keyFreq } from "../../lib/helpers/note-functions";
import { useProjectStore } from "../../states/ProjectState";
import { millisPerBeat, millisToStep, stepToMillis } from "../../lib/helpers/time-functions";
import { MouseEvent, TouchEvent } from "react";

export const PianoScore = ({pattern, channel, height, pixelsPerBeat, steps, totalNotes} : {pattern : PatternDefinition, channel : ChannelDefinition, height: number, pixelsPerBeat : number, steps : number, totalNotes: number}) => {

    const project = useProjectStore();

    let initialWidth = 0;

    const handleResizeStart = (evt: MouseEvent | TouchEvent, dir: any, el: HTMLElement) => {
        console.log(evt, el)
        initialWidth = parseInt(el.style.width.replace(/[^0-9.]/g, ''));
    }

    const handleResize = (evt: Event, el: HTMLElement, dir: any, delta: any, pos: any, index: number) => {
        const steps = (initialWidth + delta.width) / (pixelsPerBeat/4);
        //console.log(delta, parseInt(el.style.width.replace(/[^0-9.]/g, '')), el.style.width, steps);
        const cp = channel.checkpoints![index];
        const duration = steps*millisPerBeat(project.bpm)/STEPS_PER_BEAT;
        if(duration > 0){
            project.setChannelNote(pattern, channel, index, {...cp, ...{time: {...cp.time, duration}}});
        }else{
            return false;
        }
    }

    const handleResizeStop = (event: any, dir: any, el: HTMLElement, delta: any, pos: any, index: number)=>{
        const w = parseInt(el.style.width.replace(/[^0-9.]/g, ''));
        const steps = w / (pixelsPerBeat/STEPS_PER_BEAT);
        const cp = channel.checkpoints![index];
        const duration = steps*millisPerBeat(project.bpm)/STEPS_PER_BEAT;
        if(duration > 0){
            project.setChannelNote(pattern, channel, index, {...cp, ...{time: {...cp.time, duration}}});
        }
    }

    const handleDragStop = (evt: any | TouchEvent, drag: DraggableData, index: number) => {
        const key = 1+totalNotes-Math.round(drag.lastY/PIANO_KEY_HEIGHT);
        const step = drag.lastX/(pixelsPerBeat/4);
        const startTime = stepToMillis(project.bpm, step);
        if(step >= 0){
            const freq = keyFreq(key);
            if(freq && freq > 0){
                const cp = channel.checkpoints![index];
                project.setChannelNote(pattern, channel, index, {...cp, ...{note: freq, time:{ ...cp.time, ...{start: startTime}}, step: step}})
            }
        }
        
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
                        <Rnd 
                            onResizeStart={(event, dir, el)=>handleResizeStart(event, dir, el)} 
                            onResize={(event, dir, el, delta, pos)=>handleResize(event, el, dir, delta, pos, i)} 
                            onResizeStop={(event, dir, el, delta, pos)=>handleResizeStop(event, dir, el, delta, pos, i)}
                            onDragStop={(event, data)=>handleDragStop(event, data, i)} 
                            position={{x: (pixelsPerBeat/4)*_cp.step, y}} 
                            size={{
                                width: ( (_cp.time.duration / millisPerBeat(project.bpm) )*(pixelsPerBeat)), 
                                height: PIANO_KEY_HEIGHT
                            }} 
                            enableResizing={{bottom: false, bottomLeft: false, bottomRight: false, left: false, right: true, top: false, topLeft: false, topRight: false}} 
                            resizeGrid={[pixelsPerBeat/4, 0]} 
                            dragGrid={[pixelsPerBeat/4, PIANO_KEY_HEIGHT+1]} 
                            bounds="parent" 
                            key={i}
                        >
                            <div style={{height: PIANO_KEY_HEIGHT, width: '100%', borderRadius: '4px', padding: '2px', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', backgroundColor: '#9f9'}}>𝅘𝅥𝅮</div>
                        </Rnd>
                    )
                })}
            </div>
        </>
    )
}
