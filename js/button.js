import { Draggable } from "https://esm.run/melonjs@13.0"

export class Button extends Draggable {
    constructor(x, y, settings) {
        super(x, y, settings.width, settings.height);
        this.color = "white";
    }
    update(dt) {
        super.update(dt);
        return true;
    }
    draw(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
    dragStart(e) {
        super.dragStart(e);
        this.color = "blue";
        this.synth.play();
    }
    dragMove(e) {
        super.dragMove(e);
        var co_control = Math.min(10, this.pos.y / 50);
        this.synth.cutoff = co_control / 4 + 0.5;
        this.synth.setFreq(this.pos.x);
        
    }
    dragEnd(e) {
        super.dragEnd(e);
        this.color = "white";
        this.synth.stop();
    }
};
