import { instrumentRegistry } from "./registry";

class Engine{
    static instance : Engine;

    ctx !: AudioContext;
    initialized : boolean = false;
    instruments : Map<string, AudioWorkletNode> = new Map();

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
            instr.port.postMessage({type: 'play', data: frequency});
            instr.connect(this.ctx.destination)
        }
    }
}

const instance = new Engine();

export default instance;