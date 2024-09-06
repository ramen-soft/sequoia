import { create } from "zustand";
import { ChannelDefinition, PatternDefinition, TrackDefinition } from "../models/models";
import { produce } from "immer";

type ProjectState = {
    title: string;
    bpm: number;
    instruments: string[];
    patterns: PatternDefinition[];
    tracks: TrackDefinition[];
    editingPattern ?: PatternDefinition;
    addTrack: (t:string) => void;
    setActivePattern : (p : PatternDefinition | undefined) => void;

    addChannel: (p: PatternDefinition, c: ChannelDefinition) => void;
    setInstrument: (pattern: PatternDefinition, channel: ChannelDefinition, instrument: string) => void;
    setPattern: (index: number, pattern: PatternDefinition) => void;
    setPatternLength: (pattern: PatternDefinition, length: number) => void;
    setChannelNotes: (pattern: PatternDefinition, channel: ChannelDefinition, checkpoints: any[]) => void;
    setChannelNote: (pattern: PatternDefinition, channel: ChannelDefinition, checkpointIndex: number, note:any) => void;
}

export const useProjectStore = create<ProjectState>((set)=> ({
    title: 'tarari',
    bpm: 96,
    instruments: [],
    patterns: [
        {
            name: 'Pattern 01',
            steps: 16,
            channels: [
                {
                    instrument: "sequoia/piano",
                    name: 'Channel 01',
                    checkpoints: [],
                    notes: [],
                    type: "pad"
                }
            ]
        }
    ],
    tracks: [],
    addTrack: (t:TrackDefinition)=>set(produce((state : ProjectState)=>{state.tracks.push(t)})),
    setActivePattern: p => set(produce((state: ProjectState)=>{state.editingPattern = p})),
    addChannel: (pattern, newChannel) => set(produce((state: ProjectState)=>{
        const pat = state.patterns.find(pat=>pat.name===pattern.name);
        if(pat){
            pat.channels.push(newChannel);
        }
    })),
    setInstrument: (pattern, channel, instrument) => set(produce((state: ProjectState)=>{
        const chan = state.patterns.find(pat=>pat.name===pattern.name)?.channels.find(ch=>ch.name===channel.name)
        if(chan){
            chan.instrument = instrument;
        }
    })),
    setPattern: (index, pattern) => set(produce((state: ProjectState) => {
        const pats = state.patterns;
        pats.splice(index, 1, pattern);
    })),
    setPatternLength: (pattern, length) => set(produce((state: ProjectState) => {
        const pat = state.patterns.find(pat=>pat.name===pattern.name);
        if(pat){
            pat.steps = length;
        }
    })),
    setChannelNotes: (pattern: PatternDefinition, channel: ChannelDefinition, checkpoints: any[]) => set(produce((state: ProjectState) => {
        const chan = state.patterns.find(pat=>pat.name===pattern.name)?.channels.find(ch=>ch.name===channel.name);
        if(chan)
            chan.checkpoints = checkpoints;
    })),
    setChannelNote: (pattern: PatternDefinition, channel: ChannelDefinition, checkpointIndex: number, note: any) => set(produce((state: ProjectState) => {
        const ckpts = state.patterns.find(pat=>pat.name===pattern.name)?.channels.find(ch=>ch.name===channel.name)?.checkpoints;
        if(ckpts && ckpts[checkpointIndex]){
            ckpts[checkpointIndex] = note;
        }
    }))
}))