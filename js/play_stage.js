import { Stage, game, ColorLayer } from "https://esm.run/melonjs@13.0" //'melonjs/dist/melonjs.module.js';

import { Button } from "./button.js";
import { Cloud, Platform } from "./entities.js";
import { Synth } from "./synth.js"

class PlayScreen extends Stage {
    onResetEvent() {
        game.world.addChild(new ColorLayer("background", "#202020"));

        this.limiter = new AudioWorkletNode(
            this.audio_context, "bw_limiter_js", {outputChannelCount: [1]}
        );
        this.limiter.connect(this.audio_context.destination);

        this.destination = this.limiter;
        // this.destination = this.audio_context.destination;

        this.btn = new Button(70, 45, {width : 80, height : 30});
        this.cloud = new Cloud(140, 90, {width : 80, height : 30});
        this.platform = new Platform(600, 450, {width : 600, height : 30});
        this.platform.synth = new Synth(this.audio_context);

        this.platform.synth.init(this.destination);
        game.world.addChild(this.btn);
        game.world.addChild(this.cloud);
        game.world.addChild(this.platform);

        this.btn.synth = new Synth(this.audio_context);
        this.btn.synth.init(this.destination);
    }
    onDestroyEvent() {

    }
};

export default PlayScreen;
