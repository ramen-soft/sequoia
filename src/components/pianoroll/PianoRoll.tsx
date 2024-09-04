import { useContext, useEffect, useState } from "react";
import { SeqContext } from "../../context/SeqContext";
import { ChannelDefinition, KeyDef, PatternDefinition } from "../../models/models";
import { DDialog } from "../ui/DDialog";
import { PIANO_ROLL_TOTAL_HEIGHT, PIXELS_PER_BEAT } from "./consts";
import { PianoKeys } from "./PianoKeys";
import styles from './PianoRoll.module.css';
import { PianoScore } from "./PianoScore";

export const PianoRoll = ({pattern, channel} : {pattern : PatternDefinition, channel : ChannelDefinition}) => {

    const { engine } = useContext(SeqContext);

    const [ playedKey, setPlayedKey ] = useState<KeyDef|null>();

    useEffect(()=>{
        if(engine.initialized && channel.instrument && playedKey){
            engine.play(channel.instrument, [playedKey.freq]);
        }
    }, [playedKey])

    return (
        <>
            <DDialog title="Piano Roll">
                <div className={styles['sq-piano-roll']}>
                    <div className={styles['pr-keys']}>
                        <PianoKeys onKey={(key)=>setPlayedKey(key)} />
                    </div>
                    <div className={styles['pr-score']}>
                        <PianoScore pattern={pattern} channel={channel} height={PIANO_ROLL_TOTAL_HEIGHT} steps={pattern.steps} pixelsPerBeat={PIXELS_PER_BEAT} />
                    </div>
                </div>
            </DDialog>
        </>
    )
}
