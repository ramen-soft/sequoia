import { useContext, useEffect, useState } from "react";
import { SeqContext } from "../../context/SeqContext";
import { ChannelDefinition, KeyDef, PatternDefinition } from "../../models/models";
import { DDialog } from "../ui/DDialog";
import { OCTAVES, PIANO_KEY_WIDTH, PIANO_ROLL_TOTAL_HEIGHT, PIXELS_PER_BEAT } from "./consts";
import { PianoKeys } from "./PianoKeys";
import styles from './PianoRoll.module.css';
import { PianoScore } from "./PianoScore";
import { useProjectStore } from "../../states/ProjectState";
export const PianoRoll = () => {

    const project = useProjectStore();

    const [pattern, setPattern] = useState<PatternDefinition|undefined>()
    const [channel, setChannel] = useState<ChannelDefinition|undefined>()

    useEffect(()=>{
        const pat = project.patterns.find(p=>p.id===project.pianoRoll?.patternId)
        const chan = pat?.channels.find(ch=>ch.id===project.pianoRoll?.channelId)
        setPattern(pat)
        setChannel(chan)
    }, [project.pianoRoll, project.patterns])

    const { engine } = useContext(SeqContext);

    const totalNotes = 12 * OCTAVES+1;

    const [ playedKey, setPlayedKey ] = useState<KeyDef|null>();

    useEffect(()=>{
        if(engine.initialized && channel?.instrument && playedKey){
            engine.play(channel.instrument, [playedKey.freq]);
        }
    }, [playedKey, channel?.instrument, engine])

    return (
        <>
            <DDialog title="Piano Roll" onDialogClose={()=>project.clearPianoRoll()}>
                { pattern && channel && (
                <div className={styles['sq-piano-roll']} style={{width: `${25+PIANO_KEY_WIDTH + (PIXELS_PER_BEAT/4*pattern.steps+1)}px`}}>
                    <div className={styles['pr-keys']}>
                        <PianoKeys onKey={(key)=>setPlayedKey(key)}/>
                    </div>
                    <div className={styles['pr-score']}>
                        { pattern && channel && (
                        <PianoScore totalNotes={totalNotes} pattern={pattern} channel={channel} height={PIANO_ROLL_TOTAL_HEIGHT} steps={pattern.steps} pixelsPerBeat={PIXELS_PER_BEAT} />
                        )}
                    </div>
                </div>
                )}
            </DDialog>
        </>
    )
}
