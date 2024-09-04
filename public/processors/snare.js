class SnareProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.attackTime = 0.002; // Attack time in seconds
        this.decayTime = 0.2;    // Decay time in seconds
        this.toneFrequency = 200; // Frequency of the tone part of the snare
        this.sampleRate = sampleRate;
        this.phase = 0;
        this.currentTime = 0;
        this.isPlaying = true;   // Flag to indicate if the snare is playing

        this.port.onmessage = (event)=>{
            const { type, data } = event.data;
            if(type === 'play'){
                this.resetParameters();
            }else if(type === 'reset'){
                this.resetParameters();
            }
        }
    }

    resetParameters(){
        this.attackTime = 0.002; // Attack time in seconds
        this.decayTime = 0.15;    // Decay time in seconds
        this.frequency = 200;    // Starting frequency of the kick
        this.sampleRate = sampleRate;
        this.currentTime = 0;
        this.isPlaying = true;
    }
  
    process(inputs, outputs, parameters) {
      const output = outputs[0];
      const outputChannel = output[0];
  
      if (!this.isPlaying) {
        return false;
      }
  
      for (let i = 0; i < outputChannel.length; i++) {
        // Calculate the current amplitude envelope
        let envelope;
        if (this.currentTime < this.attackTime) {
          envelope = this.currentTime / this.attackTime;
        } else if (this.currentTime < this.attackTime + this.decayTime) {
          envelope = 1 - (this.currentTime - this.attackTime) / this.decayTime;
        } else {
          envelope = 0;
          //console.log('end');
          //this.isPlaying = false; // Stop playing after the decay phase
        }
    
  
        // Generate noise for the snare drum "rattle" part
        const noise = Math.random() * 2 - 1;
  
        // Generate the tone part
        const tone = Math.sin(2 * Math.PI * this.toneFrequency * this.currentTime);
  
        // Mix the tone and noise with the envelope applied
        outputChannel[i] = (tone + noise) * envelope * 0.2;
  
        // Increment time
        this.currentTime += 1 / this.sampleRate;
      }
  
      return true;
    }
  }
  
  registerProcessor('sequoia/snare', SnareProcessor);