import { Entity, Draggable, Body, Rect, game, timer, collision } from "https://esm.run/melonjs@13.0"

export class Droplet extends Entity {
    constructor(x, y, settings) {
        super(x, y, settings);
        this.color = "green";
        this.body.gravityScale = 0.1;
        this.body.collisionType = collision.types.ENEMY_OBJECT;
        this.alwaysUpdate = true;
    }
    update(dt) {
        if (this.pos.y > game.viewport.getBounds().max.y) {
            game.world.removeChild(this);
        }
        return super.update(dt);
    }
    draw(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(0, 0, this.width, this.height);
    }
};

export class Platform extends Draggable {
    constructor(x, y, settings) {
        super(x, y, settings.width, settings.height);
        this.color = "yellow";
        this.body = new Body(
            this,
            new Rect(
                -settings.width / 2,
                -settings.height / 2,
                settings.width,
                settings.height,
            ),
        );
        this.body.ignoreGravity = true;
    }
    onCollision(response, other) {
        if (other.body.collisionType === collision.types.ENEMY_OBJECT) {
            game.world.removeChild(other);
            this.synth.cutoff = 0.75 + Math.pow(other.body.vel.y, 2) / 15;
            this.synth.play();
            this.synth.stop(0.2);
        }
        return false;
    }
    dragMove(e) {
        super.dragMove(e);
        this.synth.setFreq(440 + game.viewport.getBounds().max.y - this.pos.y);
    }
    draw(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
};

export class Cloud extends Draggable {
    constructor(x, y, settings) {
        super(x, y, settings.width, settings.height);
        this.color = "grey";
        timer.setInterval(this.createDroplet.bind(this), 500);
        
    }
    createDroplet() {
        var shift = Math.random() * (this.width - 20) - this.width / 2;
        game.world.addChild(new Droplet(this.pos.x + shift, this.pos.y, {width : 20, height : 40}));
    }
    draw(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
};