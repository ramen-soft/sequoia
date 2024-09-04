class KickProcessor extends AudioWorkletProcessor {
    constructor(){
        super();
        this.phase = 0;
        this.attackTime = 0.001; // Attack time in seconds
        this.decayTime = 0.1;    // Decay time in seconds
        this.frequency = 150;    // Starting frequency of the kick
        this.sampleRate = sampleRate;
        this.currentTime = 0;

        this.port.onmessage = (event)=>{
            const { type, data } = event.data;
            if(type === 'play'){
                this.phase = 0
                this.currentTime = 0;
            }
            else if(type === 'reset'){
                this.resetParameters();
            }
        }
    }

    resetParameters(){
        this.phase = 0;
        this.attackTime = 0.001; // Attack time in seconds
        this.decayTime = 0.1;    // Decay time in seconds
        this.frequency = 150;    // Starting frequency of the kick
        this.sampleRate = sampleRate;
        this.currentTime = 0;
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const outputChannel = output[0];

        for (let i = 0; i < outputChannel.length; i++) {
            // Calculate the current amplitude envelope
            let envelope;
            if (this.currentTime < this.attackTime) {
                envelope = this.currentTime / this.attackTime;
            } else if (this.currentTime < this.attackTime + this.decayTime) {
                envelope = 1 - (this.currentTime - this.attackTime) / this.decayTime;
            } else {
                envelope = 0;
            }

            // Calculate the current frequency (linear decay)
            let currentFrequency = this.frequency * (1 - this.currentTime / (this.attackTime + this.decayTime));
            let increment = (2 * Math.PI * currentFrequency) / this.sampleRate;

            // Generate the sine wave with the envelope applied
            outputChannel[i] = Math.sin(this.phase) * envelope;

            // Increment the phase and time
            this.phase += increment;
            this.currentTime += 1 / this.sampleRate;

            // Loop the kick sound (optional, depending on your use case)
            /*
            if (this.currentTime > this.attackTime + this.decayTime) {
                this.currentTime = 0;
                this.phase = 0;
            }
            */
        }

        return true;
    }
}

registerProcessor('sequoia/kick', KickProcessor);