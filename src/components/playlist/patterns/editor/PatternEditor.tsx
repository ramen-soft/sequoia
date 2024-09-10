import { useContext, useState } from "react"
import { SeqContext } from "../../../../context/SeqContext"
import { useTick } from "../../../../hooks/useTick"
import { stepToMillis } from "../../../../lib/helpers/time-functions"
import { ChannelDefinition, PatternDefinition } from "../../../../models/models"
import { DDialog } from "../../../ui/DDialog"
import { Channel } from "./Channel"
import { ChannelHead } from "./ChannelHead"
import styles from './PatternEditor.module.css'
import { useProjectStore } from "../../../../states/ProjectState"
import { SQButton } from "../../../ui/SQButton"
import { v4 as uuid } from 'uuid'

export const PatternEditor = ({pattern} : {pattern : PatternDefinition}) => {

    const project = useProjectStore();

    const {engine} = useContext(SeqContext);

    const [currentStep, setCurrentStep] = useState(0);

    useTick(()=>{
        const ms = stepToMillis(project.bpm, currentStep);
        const notes = pattern.channels.map(chan=>chan.checkpoints?.filter(cp=>cp.time.start==ms).map(note => {
            return {...note, note: note.note||440, instrument: chan.instrument}
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
        project.setActivePattern(null)
    }

    const handleAddChannel = () => {
        console.log(pattern);
        project.addChannel(pattern, {
            id: uuid(),
            instrument: pattern.channels.length?pattern.channels[0].instrument:project.instruments[0],
            name: 'Channel ' + (pattern.channels.length + 1).toString().padStart(2, '0'),
            checkpoints: [],
            type: "pad"
        })
    }

    const handleInstrumentChange = (channel : ChannelDefinition, instrumentId: string) => {
        project.setInstrument(pattern, channel, instrumentId);
    }

    const handleChangeSteps = (e : React.ChangeEvent<HTMLInputElement>) => {
        const newStepCount = Number(e.currentTarget?.value);
        project.setPatternLength(pattern, newStepCount);
    }

    const tools = <>
        <div className={styles.tool}>
            <label>Steps</label>
            <input className={styles.stepCountInput} type="text" value={pattern.steps} onClick={e=>e.currentTarget.selectionEnd=1000} onMouseDown={(e)=>{e.stopPropagation(); } } onInput={handleChangeSteps} />
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
                            <Channel key={i} pattern={pattern} channel={channel} stepCount={pattern.steps} currentStep={currentStep}></Channel>
                        ))}
                        </div>
                    </div>
                    <div className={styles.patternEditorFooter}>
                        <SQButton onClick={handleAddChannel}>+ Channel</SQButton>
                    </div>
                </div>
            </DDialog>
        </>
    )
}
