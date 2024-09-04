export interface ChannelDefinition{
    name: string;
    instrument: string;
    type: 'roll'|'pad';
    notes: any[];
    checkpoints ?: any[];
}

export interface PatternDefinition{
    name: string;
    steps: number;
    channels: ChannelDefinition[]
}

export interface TrackDefinition{

}

export interface Project{
    title: string;
    bpm: number;
    instruments: string[];
    patterns: PatternDefinition[];
    tracks: TrackDefinition[];
    editingPattern ?: PatternDefinition
};

export type KeyDef = {
    type: 'white'|'black';
    pos: number;
    freq: number;
    y: number;
}