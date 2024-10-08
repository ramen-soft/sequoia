import { useEffect, useState } from "react";
import { noteToFreq } from "../../../../lib/helpers/note-functions";
import { millisPerBeat, stepToMillis } from "../../../../lib/helpers/time-functions";
import { ChannelDefinition, Checkpoint, PatternDefinition } from "../../../../models/models";
import styles from './Channel.module.css';
import { ChannelStep } from "./ChannelStep";
import { useProjectStore } from "../../../../states/ProjectState";

export const Channel = ({pattern, channel, stepCount, currentStep} : {pattern: PatternDefinition, channel : ChannelDefinition, stepCount: number, currentStep: number}) => {

    const project = useProjectStore();

    const [notes, setNotes] = useState<Checkpoint[]>(channel.checkpoints);

    const steps = Array(stepCount).fill(0);

    
    const handleChannelChange = (step: number, active: boolean) => {
        const newNotes : Checkpoint[] = [...channel.checkpoints!];
        console.log(newNotes);
        const note = newNotes.find(n=>n.step===step);
        if(!note){
            newNotes.push({
                note: noteToFreq('C', 4),
                time: {
                    start: stepToMillis(project.bpm, step),
                    end: stepToMillis(project.bpm, step)+50,
                    duration: millisPerBeat(project.bpm)/4
                },
                step: step
            })
            setNotes(newNotes)
        }else{
            if(!active){
                newNotes.splice(newNotes.indexOf(note), 1);
                setNotes(newNotes)
            }
        }
    };

    useEffect(()=>{
        const checkpoints = notes.map(note=>{ return {...note, time: {...note.time, start:stepToMillis(project.bpm, note.step)}}; });
        project.setChannelNotes(pattern, channel, checkpoints);
    }, [notes]);

    return (
        <div className={styles.channel}>
            <div className={styles.channelSteps}>
            { steps.map((_step, stepIndex) => (
                <ChannelStep current={currentStep===stepIndex} active={channel.checkpoints?.find(cp=>cp.step==stepIndex)?true:false} key={stepIndex} step={stepIndex} onToggle={(_)=>{ handleChannelChange(stepIndex, _); }}></ChannelStep>
            ))}
            </div>
        </div>
    )
}
