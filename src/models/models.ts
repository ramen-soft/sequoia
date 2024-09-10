export interface Checkpoint {
    note: number,
    time: {
        start: number,
        end: number,
        duration: number
    },
    step: number;
}

export interface ChannelDefinition{
    id: string,
    name: string;
    instrument: string;
    type: 'roll'|'pad';
    checkpoints : Checkpoint[];
}

export interface PatternDefinition{
    id: string;
    name: string;
    steps: number;
    channels: ChannelDefinition[]
}

export interface TrackPattern{
    id: string;
    instanceId: string;
    time: {
        start: number
    }
}
export interface TrackDefinition{
    id: string,
    name: string,
    patterns: TrackPattern[]
}

export interface Project{
    title: string;
    bpm: number;
    instruments: string[];
    patterns: PatternDefinition[];
    tracks: TrackDefinition[];
    editingPattern ?: PatternDefinition
}

export type KeyDef = {
    type: 'white'|'black';
    pos: number;
    freq: number;
    y: number;
}