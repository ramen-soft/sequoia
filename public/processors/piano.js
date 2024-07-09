class PianoProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.polyphony = 8;
        this.phase = Array(this.polyphony).fill(0);
        this.decay = 0.9999; // Factor de decaimiento
        this.amplitude = 1.0;
        this.freqs = Array(this.polyphony).fill(0);

        this.port.onmessage = (event)=>{
            const { type } = event.data;
            let {data} = event.data;
            if(type === 'play'){
                if(!(Array.isArray(data))) data = [data];
                this.freqs = data.slice(0, this.polyphony);
                this.phase = this.freqs.map(()=>0);
                this.amplitude = 1.0*(this.freqs.length/this.polyphony);
            }
            else if(type === 'reset'){
                this.resetParameters();
            }
        }
    }

    resetParameters(){
        this.amplitude = 1.0;
        this.phase = this.freqs.map(()=>0);
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const sampleRate = 44100;

        for (let channel = 0; channel < output.length; channel++) {
            const outputChannel = output[channel];

            for (let i = 0; i < outputChannel.length; i++) {
                let sample = 0;

                for(let j=0;j<this.freqs.length;j++){
                    
                    // Generar la onda base (sinusoide)
                    sample += Math.sin(this.phase[j]) * this.amplitude;

                    // Añadir armónicos para asemejarse a un piano
                    sample += 0.6 * Math.sin(2 * this.phase[j]) * this.amplitude;
                    sample += 0.4 * Math.sin(3 * this.phase[j]) * this.amplitude;
                    sample += 0.2 * Math.sin(4 * this.phase[j]) * this.amplitude;

                    // Actualizar la fase y la amplitud
                    this.phase[j] += (2 * Math.PI * this.freqs[j]) / sampleRate;
                    if (this.phase[j] > 2 * Math.PI) {
                        this.phase[j] -= 2 * Math.PI;
                    }
                }
                // Aplicar el decaimiento
                this.amplitude *= this.decay;

                outputChannel[i] = sample / this.freqs.length;
            }
        }

        return true;
    }
}

registerProcessor('sequoia/piano', PianoProcessor);