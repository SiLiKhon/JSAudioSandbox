import { Stage, game, ColorLayer, Text  } from "https://esm.run/melonjs@13.0" //'melonjs/dist/melonjs.module.js';

import { Button } from "./button.js";
import { Synth } from "./synth.js"

class PlayScreen extends Stage {
    onResetEvent() {
        game.world.addChild(new ColorLayer("background", "#202020"));

        this.btn = new Button(70, 45, {width : 80, height : 30});
        game.world.addChild(
            this.btn
        );

        this.btn.synth = new Synth(this.audio_context);
        this.btn.synth.init(this.audio_context.destination);
    }
    onDestroyEvent() {

    }
};

export default PlayScreen;
