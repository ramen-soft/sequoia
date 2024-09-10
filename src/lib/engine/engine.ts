import { instrumentRegistry } from "./registry";

export const NOTE_FREQUENCIES : {[key:string]:number} = {
    'C':261,
    'D':293,
    'E':329,
    'F':349,
    'G':392,
    'A':440,
    'B':493
}

class Engine{
    static instance : Engine;

    ctx !: AudioContext;
    initialized : boolean = false;
    instruments : Map<string, AudioWorkletNode> = new Map();

    masterGain !: GainNode;

    constructor(){
        if(Engine.instance)
            return Engine.instance;
        Engine.instance = this;
        return this;
    }

    init(){
        if(!this.initialized){
            console.info('Initializing engine...');
            this.ctx = new AudioContext({sampleRate: 44100});
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        }else{
            console.info('Engine already initialized.');
        }
    }

    loadInstrument(name : string){
        if(!this.initialized){
            throw new Error('Sequoia engine not initialized.');
        }
        return this.ctx?.audioWorklet.addModule(instrumentRegistry[name].processor);
    }

    loadInstruments(names : string[]){
        if(!this.initialized){
            throw new Error('Sequoia engine not initialized.');
        }
        const instrumentsLoadingPromise = Promise.all(names.map(name=>this.ctx?.audioWorklet.addModule(instrumentRegistry[name].processor)));
        instrumentsLoadingPromise.then(()=>{
            names.forEach(name=>this.instruments.set(instrumentRegistry[name].id, new AudioWorkletNode(this.ctx as AudioContext, instrumentRegistry[name].id)))
        });
        return instrumentsLoadingPromise;
    }

    play(instrument: string, frequency: number | number[]){
        const instr = this.instruments.get(instrument);
        if(instr){
            instr.connect(this.masterGain);
            instr.port.postMessage({type: 'play', data: frequency});
        }
    }
}

const instance = new Engine();

export default instance;