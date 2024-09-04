import { useContext, useEffect, useState } from "react";
import { SeqContext } from "../../context/SeqContext";
import { ChannelDefinition, KeyDef, PatternDefinition } from "../../models/models";
import { DDialog } from "../ui/DDialog";
import { OCTAVES, PIANO_KEY_WIDTH, PIANO_ROLL_TOTAL_HEIGHT, PIXELS_PER_BEAT } from "./consts";
import { PianoKeys } from "./PianoKeys";
import styles from './PianoRoll.module.css';
import { PianoScore } from "./PianoScore";
export const PianoRoll = ({pattern, channel} : {pattern : PatternDefinition, channel : ChannelDefinition}) => {

    const { engine } = useContext(SeqContext);

    const totalNotes = 12 * OCTAVES+1;

    const [ playedKey, setPlayedKey ] = useState<KeyDef|null>();

    useEffect(()=>{
        if(engine.initialized && channel.instrument && playedKey){
            engine.play(channel.instrument, [playedKey.freq]);
        }
    }, [playedKey, channel.instrument, engine])

    return (
        <>
            <DDialog title="Piano Roll">
                <div className={styles['sq-piano-roll']} style={{width: `${25+PIANO_KEY_WIDTH + (PIXELS_PER_BEAT/4*pattern.steps+1)}px`}}>
                    <div className={styles['pr-keys']}>
                        <PianoKeys onKey={(key)=>setPlayedKey(key)}/>
                    </div>
                    <div className={styles['pr-score']}>
                        <PianoScore totalNotes={totalNotes} pattern={pattern} channel={channel} height={PIANO_ROLL_TOTAL_HEIGHT} steps={pattern.steps} pixelsPerBeat={PIXELS_PER_BEAT} />
                    </div>
                </div>
            </DDialog>
        </>
    )
}
