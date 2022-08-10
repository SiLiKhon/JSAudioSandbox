import {
    audio,
    loader,
    state,
    device,
    video,
    utils,
    plugin,
    pool
} from "https://esm.run/melonjs@13.0"

import PlayScreen from './js/play_stage.js';

var audio_context = new window.AudioContext();

device.onReady(async () => {
    if (!video.init(1218, 562, {parent : "screen", scale : "auto"})) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // audio.init("mp3,ogg");

    // loader.crossOrigin = "anonymous";

    // loader.preload(DataManifest, function() {
    //     state.set(state.PLAY, new PlayScreen());

    //     // add our player entity in the entity pool
    //     // pool.register("mainPlayer", PlayerEntity);

    //     state.change(state.PLAY);
    // });
    await audio_context.audioWorklet.addModule('./js/processors.js')
    var screen = new PlayScreen();
    screen.audio_context = audio_context;
    state.set(state.PLAY, screen);
    state.change(state.PLAY);
});
