// Player

import { JUMP_VELOCITY, GRAVITY, TERMINAL_VELOCITY } from './Constants';
import { Sprite } from './Sprite';
import { Camera } from './Camera';
import { Viewport } from './Viewport';
import { Input } from './input/Input';
import { game } from './Game';
import { LandingParticle } from './Particle';

export class Player {
    constructor(pos) {
        this.pos = { ...pos };
        this.vel = { x: 0, y: 0 };
        this.frame = 0;
        this.radius = 4;
        this.jumpLength = 0;
        this.jumpFrames = 0;
        this.facing = 0;
        this.isJumping = true;

        this.bb = [{ x: -7, y: -4 }, { x: 7, y: 5 }];

        // temp
        this.noClipEntity = true;
        this.noClipWall = true;
        this.newClip = true;
    }

    update() {
        console.log(this.vel.y, this.pos.x, this.pos.y);

        let v = {
            x: Input.direction.x * Input.direction.m * 0.4,
            y: Input.direction.y * Input.direction.m * 0.4
        };

        this.vel.x = (this.vel.x + v.x) / 2;
        //this.vel.y = (this.vel.y + v.y) / 2;

        // move
        ///this.pos.x += this.vel.x;
        ///this.pos.y += this.vel.y;

        if (Input.pressed[Input.Action.JUMP] && !this.isJumping) {
            this.isJumping = true;
            //this.jumpFrames = 16;
            //this.jumpLength = 0;
            this.vel.y = 0 - JUMP_VELOCITY - GRAVITY;
        }

        /*if (this.jumpFrames > 0) {
            this.jumpFrames--;
            this.jumpLength++;
            this.vel.y = -1.2;
        }

        if (Input.held[Input.Action.JUMP] && this.jumpFrames < 1 && this.jumpLength < 36) {
            this.jumpFrames = 1;
        }*/

        console.log(GRAVITY);
        this.vel.y += GRAVITY;
        //this.vel.y += 0.12;

        if (this.vel.y > TERMINAL_VELOCITY) this.vel.y = TERMINAL_VELOCITY;

        if (this.vel.x > 0) this.facing = 0;
        if (this.vel.x < 0) this.facing = 1;
    }

    landedOnTile(tile) {
        if (this.isJumping) {
            this.isJumping = false;
            game.screen.landedOnTile(tile);
        }
    }

    draw() {
        Sprite.drawViewportSprite(Sprite.bigpig[this.facing][this.frame], { x: this.pos.x, y: this.pos.y });
    }
}
