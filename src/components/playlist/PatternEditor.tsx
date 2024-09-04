import { useContext, useState } from "react"
import { ProjectContext } from "../../context/ProjectContext"
import { SeqContext } from "../../context/SeqContext"
import { useTick } from "../../hooks/useTick"
import { stepToMillis } from "../../lib/helpers/time-functions"
import { ChannelDefinition, PatternDefinition } from "../../models/models"
import { DDialog } from "../ui/DDialog"
import { Channel } from "./Channel"
import { ChannelHead } from "./ChannelHead"
import styles from './PatternEditor.module.css'

export const PatternEditor = ({pattern} : {pattern : PatternDefinition}) => {

    const {project, setProject} = useContext(ProjectContext);
    const [stepCount, setStepCount] = useState(pattern.steps);

    const {engine} = useContext(SeqContext);

    const [currentStep, setCurrentStep] = useState(0);

    useTick(()=>{
        const ms = stepToMillis(project.bpm, currentStep);
        const notes = pattern.channels.map(chan=>chan.checkpoints?.filter(cp=>cp.time.start==ms).map(note => {
            note.instrument = chan.instrument;
            note.note = 440.0;
            return note;
        })).flat()
        if(notes.length > 0){
            const notesByInstrument = Object.entries(Object.groupBy(notes, (note)=>note.instrument)).map(n=>{return{[n[0]]: n[1]?.map(nn=>nn.note)}}).flat()
            notesByInstrument.forEach((notes:any)=>{
                const iname = Object.keys(notes)[0];
                const noteArray = Object.values<number>(notes)[0];
                engine.play(iname, noteArray);
            });
        }
        setCurrentStep(currentStep+1 < pattern.steps ? currentStep + 1 : 0)
    })

    const handleClose = () => {
        setProject({...project, ...{editingPattern: undefined}});
    }

    const handleAddChannel = () => {
        const patterns = structuredClone(project.patterns);
        const pat = patterns.find(p=>p.name === pattern.name);
        if(pat){
            const { channels } = pat;
            channels.push({
                instrument: pattern.channels[0].instrument,
                name: 'Channel ' + (pattern.channels.length + 1).toString().padStart(2, '0'),
                notes: [],
                type: "pad"
            });
            setProject({...project, ...{patterns: patterns}})
        }
    }

    const handleInstrumentChange = (channel : ChannelDefinition, instrumentId: string) => {
        const patterns = structuredClone(project.patterns)
        const pat = patterns.find(p=>p.name === pattern.name)
        if(pat){
            const { channels } = pat;
            const chan = channels.find(chans=>chans.name==channel.name)
            if(chan){
                chan.instrument = instrumentId;

                setProject({...project, ...{patterns: patterns}})
            }
        }
    }

    const handleChangeSteps = (e : React.ChangeEvent<HTMLInputElement>) => {
        const newStepCount = Number(e.currentTarget?.value);
        setStepCount(newStepCount)
        const patterns = structuredClone(project.patterns);
        const pat = patterns.find(p=>p.name === pattern.name);
        if(pat){
            pat.steps = newStepCount;
            setProject({...project, ...{patterns: patterns}})
        }
    }

    const tools = <>
        <div className={styles.tool}>
            <label>Steps</label>
            <input className={styles.stepCountInput} type="text" value={stepCount} onClick={e=>e.currentTarget.selectionEnd=1000} onMouseDown={(e)=>{e.stopPropagation(); } } onInput={handleChangeSteps} />
        </div>
    </>

    return (
        <>
            <DDialog title={pattern.name} onDialogClose={handleClose} titleBarTools={tools}>
                <div className={styles.patternEditorWrapper}>
                    
                    <div className={styles.patternChannels}>
                        <div className={styles.channelList}>
                            <ul>
                            { pattern.channels.map((channel, i) => (
                                <ChannelHead channel={channel} key={i} onInstrumentChange={handleInstrumentChange}/>
                                /*<li key={i}>{channel.name}</li>*/
                            ))}
                            </ul>
                        </div>
                        <div className={styles.channelStepsList}>
                        { pattern.channels.map((channel, i) => (
                            <Channel key={i} pattern={pattern} channel={channel} stepCount={stepCount} currentStep={currentStep}></Channel>
                        ))}
                        </div>
                    </div>
                    <div className={styles.patternEditorFooter}>
                        <button onClick={handleAddChannel}>+ Channel</button>
                    </div>
                </div>
            </DDialog>
        </>
    )
}
