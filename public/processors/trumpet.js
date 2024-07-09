class TrumpetProcessor extends AudioWorkletProcessor{
    constructor(){
        super();
        this.phase = 0;
        this.freq = 440;

        this.port.onmessage = (event)=>{
            const { type, data } = event.data;
            if(type === 'play'){
                this.freq = data;
                this.phase = 0;
            }
            else if(type === 'reset'){
                this.resetParameters();
            }
        }
    }

    resetParameters(){
        this.freq = 440;
        this.phase = 0;
    }

    process(inputs, outputs, parameters){
        const [output] = outputs;
        const sampleRate = 44100;

        for(let channel = 0; channel < output.length; channel++){
            const outputChannel = output[channel];

            for(let i = 0; i < outputChannel.length; i++){
                let sample = Math.sin(this.phase);

                sample += 0.5 * Math.sin(2 * this.phase);
                sample += 0.25 * Math.sin(3 * this.phase);
                sample += 0.125 * Math.sin(4 * this.phase);

                this.phase += (2 * Math.PI * this.freq) / sampleRate;
                if(this.phase > 2*Math.PI){
                    this.phase -= 2*Math.PI;
                }

                outputChannel[i] = sample / 4;
            }
        }
        return true;
    }
}
registerProcessor('sequoia/trumpet', TrumpetProcessor);