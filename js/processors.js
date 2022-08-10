const thr = 0.5;
var wasm_objects = {
    js: {mem: new WebAssembly.Memory({initial: 1})}
};

class Distortion extends AudioWorkletProcessor {
    constructor(options) {
        super();
        if (!Distortion.hasOwnProperty("distort")) {
            Distortion.distort = null;
            WebAssembly.instantiate(
                options.processorOptions.wasm_module, wasm_objects
            ).then(
                (instance) => {
                    Distortion.distort = instance.exports.distort;
                }
            );
        }
    }
    process(inputs, outputs, parameters) {
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
            Distortion.distort(thr, input[i_ch].length);
            output[i_ch].set(output_buf);

            // for (let i_sample = 0; i_sample < input[i_ch].length; i_sample++) {
            //     if (Math.abs(input[i_ch][i_sample]) < thr) {
            //         output[i_ch][i_sample] = input[i_ch][i_sample];
            //     } else {
            //         output[i_ch][i_sample] = thr * Math.sign(input[i_ch][i_sample]);
            //     }
            // }
        }
        return true;
    }
};

registerProcessor("distortion", Distortion);
