import { useState } from "react";
import { KeyDef } from "../../models/models";
import { OCTAVES, PIANO_KEY_HEIGHT, PIANO_ROLL_TOTAL_HEIGHT } from "./consts";
import { PianoKey } from "./PianoKey";
import { keyFreq, keyLabel, posIsBlackKey } from "../../lib/helpers/note-functions";

const noteList : KeyDef[] = new Array(12 * OCTAVES).fill(0).map((_, i) => {
    return posIsBlackKey(i)
    ? {"type":"black", "pos":i, freq: 0, "y":0}
    : {"type":"white", "pos":i, freq: 0, "y":0}
});

const blackNotes : KeyDef [] = [];

const whiteNotes = noteList.filter(note=>note.type=="white").map((note, i) => {
    note.y = PIANO_ROLL_TOTAL_HEIGHT - (i*PIANO_KEY_HEIGHT+i) - PIANO_KEY_HEIGHT;
    const mod = note.pos%12;
    note.freq = keyFreq(note.pos);
    if([2,4,7,9,11].includes(mod)){
        blackNotes.push({
            "type":"black",
            "pos":note.pos-1,
            "freq":keyFreq(note.pos-1),
            "y": note.y + PIANO_KEY_HEIGHT - 5
        })
    }
    return note;
})

export const PianoKeys = ({onKey = ()=>{}} : {onKey : (key: KeyDef | null)=>void}) => {
    const [isKeyDown, setIsKeyDown] = useState(false);
    const [lastKey, setLastKey] = useState<KeyDef|null>(null);

    const handleKeyClick = (key:KeyDef|null) => {
        if((key && lastKey != key) || (key && isKeyDown && (lastKey != key ||lastKey == null))){
            setLastKey(key)
            onKey(key);
        }
    }

    return (
      <svg
        width="100%"
        height={PIANO_ROLL_TOTAL_HEIGHT}
        onMouseDown={() => setIsKeyDown(true)}
        onMouseUp={() => {
          setIsKeyDown(false);
          setLastKey(null);
          onKey(null);
        }}
      >
        {whiteNotes.map((key, pos) => (
          <PianoKey
            key={pos}
            type="white"
            label={keyLabel(key.pos)}
            keyPos={key.pos}
            y={key.y}
            onKey={()=>handleKeyClick(key)}
          />
        ))}
        {blackNotes.map((key, pos) => (
          <PianoKey
            key={pos}
            type="black"
            label=""
            keyPos={key.pos}
            y={key.y}
            onKey={()=>handleKeyClick(key)}
          />
        ))}
      </svg>
    );
}