export class Synth {
    constructor(audioContext, type="square", cutoff=2) {
        this.ctx = audioContext;
        this._isInitialized = false;
        this._started = false;
        this._type = type;
        this.cutoff = cutoff;
    };
    init(destination) {
        if (this._isInitialized) {
            throw Error("Double initialization of Synth");
        }
        if (!this._isInitialized) {
            this.destination = destination;

            this.osc = this.ctx.createOscillator();
            this.osc.frequency.value = 440;
            this.osc.type = this._type;

            this.filter = this.ctx.createBiquadFilter();
            this.filter.type = "lowpass";
            this.filter.frequency.value = this.cutoff * this.osc.frequency.value;
            this.filter.Q.value = 1;

            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0;

            this.gainNode.connect(this.filter).connect(this.destination)
            this.chain = this.gainNode;

            this._isInitialized = true;    
        }
    };
    play() {
        if (this._isInitialized) {
            if (!this._started) {
                this.osc.start(0);
                this._started = true;
            }
            this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
            this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime)
            this.gainNode.gain.exponentialRampToValueAtTime(1, this.ctx.currentTime + 0.1);
            this.osc.connect(this.chain);
        } else {
            throw Error("Synth not initialized.");
        }
    };
    stop(delay=0) {
        if (this._isInitialized) {
            this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime + delay);
            this.gainNode.gain.setValueAtTime(1, this.ctx.currentTime + delay)
            this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + 0.5);
        } else {
            throw Error("Synth not initialized.");
        }
    };
    setFreq(freq) {
        this.osc.frequency.value = freq;
        this.filter.frequency.value = this.cutoff * freq;
    };
};