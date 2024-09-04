class HiHatProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.attackTime = 0.002; // Tiempo de ataque en segundos
        this.decayTime = 0.15;   // Tiempo de decaimiento en segundos
        this.sampleRate = sampleRate;
        this.currentTime = 0;
        this.isPlaying = true;   // Indicador de si el hi-hat está sonando
  
      // Buffer de ruido
    this.noiseBuffer = new Float32Array(128);
    for (let i = 0; i < this.noiseBuffer.length; i++) {
      this.noiseBuffer[i] = Math.random() * 2 - 1;
    }

    // Coeficientes del filtro pasa-banda simple
    this.lastOutput = [0, 0];
    this.lastInput = [0, 0];

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
        this.decayTime = 0.05;    // Decay time in seconds
        this.sampleRate = sampleRate;
        this.currentTime = 0;
        this.isPlaying = true;
    }
  
    bandPass(input) {
        // Coeficientes del filtro pasa-banda
        //const a0 = 0.01, a1 = -0.02, a2 = -0.05, b1 = -0.03, b2 = 0.5;
        const a0 = 0.1, a1 = 0, a2 = -0.2, b1 = -0.51, b2 = 0.2;
        const output = a0 * input + a1 * this.lastInput[0] + a2 * this.lastInput[1] + b1 * this.lastOutput[0] + b2 * this.lastOutput[1];
    
        // Actualizar buffers
        this.lastInput[1] = this.lastInput[0];
        this.lastInput[0] = input;
        this.lastOutput[1] = this.lastOutput[0];
        this.lastOutput[0] = output;
    
        return output;
      }
    
      process(inputs, outputs, parameters) {
        const output = outputs[0];
        const outputChannel = output[0];
    
        if (!this.isPlaying) {
          return false;
        }
    
        for (let i = 0; i < outputChannel.length; i++) {
          // Calcular la envolvente de amplitud actual
          let envelope;
          if (this.currentTime < this.attackTime) {
            envelope = this.currentTime / this.attackTime;
          } else if (this.currentTime < this.attackTime + this.decayTime) {
            envelope = 1 - (this.currentTime - this.attackTime) / this.decayTime;
          } else {
            envelope = 0;
            //this.isPlaying = false; // Dejar de sonar después de la fase de decaimiento
          }
    
          // Generar ruido
          //const noise = this.noiseBuffer[i % this.noiseBuffer.length];
          const noise = Math.random() * 2 - 1;
    
          // Aplicar filtro pasa-banda al ruido
          const filteredNoise = this.bandPass(noise);
    
          // Mezclar el ruido filtrado con la envolvente aplicada
          outputChannel[i] = filteredNoise * envelope * 0.5;
    
          // Incrementar el tiempo
          this.currentTime += 1 / this.sampleRate;
        }
    
        return true;
      }
  }
  
  registerProcessor('sequoia/hithat', HiHatProcessor);
  