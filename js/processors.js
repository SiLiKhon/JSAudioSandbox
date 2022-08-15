const thr = 1.0; //0.5;
var wasm_objects = {
    js: {mem: new WebAssembly.Memory({initial: 1})}
};

class DistortionJS extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        for (let i_ch = 0; i_ch < input.length; i_ch++) {
            for (let i_sample = 0; i_sample < input[i_ch].length; i_sample++) {
                if (Math.abs(input[i_ch][i_sample]) < thr) {
                    output[i_ch][i_sample] = input[i_ch][i_sample];
                } else {
                    output[i_ch][i_sample] = thr * Math.sign(input[i_ch][i_sample]);
                }
            }
        }
        return true;
    }
};

class DistortionWASM extends AudioWorkletProcessor {
    constructor(options) {
        super();
        if (!DistortionWASM.hasOwnProperty("distort")) {
            DistortionWASM.distort = null;
            WebAssembly.instantiate(
                options.processorOptions.wasm_module, wasm_objects
            ).then(
                (instance) => {
                    DistortionWASM.distort = instance.exports.distort;
                }
            );
        }
    }
    process(inputs, outputs, parameters) {
        if (DistortionWASM.distort === null) return false;

        const input = inputs[0];
        const output = outputs[0];
        for (let i_ch = 0; i_ch < input.length; i_ch++) {
            const input_buf = new Float32Array(
                wasm_objects.js.mem.buffer, 0, input[i_ch].length
            );
            const output_buf = new Float32Array(
                wasm_objects.js.mem.buffer, input[i_ch].length * 4, input[i_ch].length
            );
            input_buf.set(input[i_ch]);
            DistortionWASM.distort(thr, input[i_ch].length);
            output[i_ch].set(output_buf);
        }
        return true;
    }
};

class BWLimiterJS extends AudioWorkletProcessor {
    constructor(options) {
        super();
        console.log("limiter channels: ", options.outputChannelCount[0]);
        this.envelope_state = (new Array(options.outputChannelCount[0])).fill(0);
        console.log("env: ", this.envelope_state);
        console.log(sampleRate);
        this.rel_len = sampleRate * 0.1;
        this.rel_gain = Math.exp(-1.0 / this.rel_len);
        this.thr_db = 0.0;
        this.thr_amp = Math.pow(10, this.thr_db / 20);
    }
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];
        for (let i_ch = 0; i_ch < input.length; i_ch++) {
            for (let i_sample = 0; i_sample < input[i_ch].length; i_sample++) {
                var env_in = Math.abs(input[i_ch][i_sample])
                if (this.envelope_state[i_ch] < env_in ) {
                    this.envelope_state[i_ch] = env_in;
                } else {
                    this.envelope_state[i_ch] = env_in + this.rel_gain * (this.envelope_state[i_ch] - env_in);
                }
                output[i_ch][i_sample] = input[i_ch][i_sample] * Math.min(1.0, this.thr_amp / this.envelope_state[i_ch]);
            }
        }
        return true;
    }
};

registerProcessor("distortion_wasm", DistortionWASM);
registerProcessor("distortion_js", DistortionJS);
registerProcessor("bw_limiter_js", BWLimiterJS);
