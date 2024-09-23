import { create } from "zustand";
import { ChannelDefinition, Checkpoint, PatternDefinition, TrackDefinition, TrackPattern } from "../models/models";
import { produce } from "immer";

type ProjectState = {
    title: string;
    bpm: number;
    instruments: string[];
    patterns: PatternDefinition[];
    tracks: TrackDefinition[];
    editingPattern : string | null;
    pianoRoll: { patternId: string, channelId: string } | null;
    addTrack: (t:TrackDefinition) => void;
    setActivePattern : (patternId : string | null) => void;

    setPianoRoll: (patternId : string, channelId: string) => void;
    clearPianoRoll: () => void;

    addChannel: (p: PatternDefinition, c: ChannelDefinition) => void;
    setInstrument: (pattern: PatternDefinition, channel: ChannelDefinition, instrument: string) => void;
    addPattern: (pattern: PatternDefinition) => void;
    setPattern: (index: number, pattern: PatternDefinition) => void;
    setPatternLength: (pattern: PatternDefinition, length: number) => void;
    setChannelNotes: (pattern: PatternDefinition, channel: ChannelDefinition, checkpoints: Checkpoint[]) => void;
    setChannelNote: (pattern: PatternDefinition, channel: ChannelDefinition, checkpointIndex: number, note:Checkpoint) => void;

    addPatternToTrack: (instanceId: string, trackId: string, patternId: string) => void;
}

export const useProjectStore = create<ProjectState>((set)=> ({
    title: 'tarari',
    bpm: 96,
    editingPattern: null,
    pianoRoll: null,
    instruments: [],
    patterns: [
    ],
    tracks: [
        {
            id: "testtrack",
            name: 'track 01',
            patterns: [
            ]
        }
    ],
    addTrack: (t:TrackDefinition)=>set(produce((state : ProjectState)=>{state.tracks.push(t)})),
    setActivePattern: patternId => set(produce((state: ProjectState)=>{
        state.editingPattern = patternId
    })),
    addChannel: (pattern, newChannel) => set(produce((state: ProjectState)=>{
        const pat = state.patterns.find(pat=>pat.id===pattern.id);
        if(pat){
            pat.channels.push(newChannel);
        }
    })),
    setInstrument: (pattern, channel, instrument) => set(produce((state: ProjectState)=>{
        const chan = state.patterns.find(pat=>pat.id===pattern.id)?.channels.find(ch=>ch.name===channel.name)
        if(chan){
            chan.instrument = instrument;
        }
    })),
    addPattern: (pattern) => set(produce((state: ProjectState) => {
        state.patterns.push(pattern)
    })),
    setPattern: (index, pattern) => set(produce((state: ProjectState) => {
        const pats = state.patterns;
        pats.splice(index, 1, pattern);
    })),
    setPatternLength: (pattern, length) => set(produce((state: ProjectState) => {
        const pat = state.patterns.find(pat=>pat.id===pattern.id);
        if(pat){
            pat.steps = length;
        }
    })),
    setChannelNotes: (pattern: PatternDefinition, channel: ChannelDefinition, checkpoints: Checkpoint[]) => set(produce((state: ProjectState) => {
        const chan = state.patterns.find(pat=>pat.id===pattern.id)?.channels.find(ch=>ch.id===channel.id);
        if(chan)
            chan.checkpoints = checkpoints;
    })),
    setChannelNote: (pattern: PatternDefinition, channel: ChannelDefinition, checkpointIndex: number, note: Checkpoint) => set(produce((state: ProjectState) => {
        const ckpts = state.patterns.find(pat=>pat.id===pattern.id)?.channels.find(ch=>ch.id===channel.id)?.checkpoints;
        if(ckpts && ckpts[checkpointIndex]){
            ckpts[checkpointIndex] = note;
        }
    })),
    addPatternToTrack: (instanceId, trackId, patternId) => set(produce((state : ProjectState) => {
        const track = state.tracks.find(t=>t.id===trackId);
        const pattern = state.patterns.find(p=>p.id===patternId);
        if(track && pattern){
            const trackPattern : TrackPattern = {
                id: pattern.id,
                instanceId,
                time: {
                    start: 0
                }
            }
            track.patterns.push(trackPattern);
        }
    })),
    setPianoRoll: (patternId, channelId) => set(produce((state : ProjectState) => {
        state.pianoRoll = {
            patternId,
            channelId
        };
    })),
    clearPianoRoll: ()=>set(produce((state: ProjectState) => { state.pianoRoll = null }))
}))