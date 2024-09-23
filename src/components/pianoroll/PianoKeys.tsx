import { useState } from "react";
import { KeyDef } from "../../models/models";
import { OCTAVES, PIANO_KEY_HEIGHT, PIANO_KEY_WIDTH, PIANO_ROLL_TOTAL_HEIGHT } from "./consts";
import { keyFreq, keyLabel, posIsBlackKey } from "../../lib/helpers/note-functions";
import { PianoKey } from "./PianoKey";

const noteList : KeyDef[] = new Array(12 * OCTAVES+1).fill(0).map((_, i) => {
  const pos = i+1;
    return posIsBlackKey(pos)
    ? {"type":"black", "pos":pos, freq: keyFreq(pos), "y":PIANO_ROLL_TOTAL_HEIGHT - (i*PIANO_KEY_HEIGHT+i) - PIANO_KEY_HEIGHT}
    : {"type":"white", "pos":pos, freq: keyFreq(pos), "y":PIANO_ROLL_TOTAL_HEIGHT - (i*PIANO_KEY_HEIGHT+i) - PIANO_KEY_HEIGHT}
});

/*
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
            "y": note.y + PIANO_KEY_HEIGHT
        })
    }
    return note;
})*/

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
        width={PIANO_KEY_WIDTH}
        height={PIANO_ROLL_TOTAL_HEIGHT}
        onMouseDown={() => setIsKeyDown(true)}
        onMouseUp={() => {
          setIsKeyDown(false);
          setLastKey(null);
          onKey(null);
        }}
      >
        
        {noteList.map((key) => (
          <PianoKey
            key={key.pos}
            type={key.type}
            label={keyLabel(key.pos)}
            keyPos={key.pos}
            y={key.y}
            onKey={()=>handleKeyClick(key)}
          />
        ))}
        
        {/*blackNotes.map((key, pos) => (
          <PianoKey
            key={pos}
            steps={steps}
            type="black"
            label=""
            keyPos={key.pos}
            y={key.y}
            onKey={()=>handleKeyClick(key)}
          />
        ))*/}
      </svg>
    );
}