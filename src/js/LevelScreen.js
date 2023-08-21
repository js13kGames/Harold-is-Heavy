// LevelScreen

import { TILE_SIZE } from './Constants';
import { LevelData } from './generated/LevelData-gen';
import { Player } from './Player';
import { Viewport } from './Viewport';
import { Sprite } from './Sprite';
import { Camera } from './Camera';
import { qr2xy, rgba, xy2uv, vectorBetween } from './Util';
import { Movement } from './systems/Movement';
import { LittlePigBox } from './LittlePigBox';
import { LandingParticle } from './Particle';
import { Text } from './Text';

export class LevelScreen {
    constructor(levelName) {
        this.levelName = levelName;
        this.levelData = LevelData[0];
        this.tiles = this.levelData.floors[0].tiles.map(row => [...row]);
        this.entities = [];

        this.player = new Player(qr2xy({ q: this.levelData.spawn[0], r: this.levelData.spawn[1] }));
        this.entities.push(this.player);

        this.littlePigs = 0;
        this.littlePigsRescued = 0;

        for (const obj of this.levelData.floors[0].objects) {
            if (obj.name === 'BOX') {
                this.entities.push(new LittlePigBox({ q: obj.x, r: obj.y }));
                this.littlePigs++;
            }
        }

        Camera.pos = { ...this.player.pos };
    }

    update() {
        //if (vectorBetween(Camera.pos, this.player.pos).m > 48) {
            Camera.forceTarget = this.player.pos;
        //}
        Camera.update();

        for (const entity of this.entities) {
            entity.update();
        }

        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].cull) {
                this.entities.splice(i, 1);
                i--;
            }
        }

        Movement.perform(this, this.entities);
    }

    draw() {
        Viewport.ctx.fillStyle = rgba(36, 26, 200, 1);
        Viewport.ctx.fillRect(0, 0, Viewport.width, Viewport.height);

        this.drawTiles();

        for (const entity of this.entities) {
            entity.draw();
        }

        Text.drawText(Viewport.ctx, `${this.littlePigsRescued}/${this.littlePigs}`, 180, 5, 1);
    }

    drawTiles() {
        const offset = xy2uv({ x: 0, y: 0 });
        const tiles = this.tiles;

        for (let r = 0; r < tiles.length; r++) {
            for (let q = 0; q < tiles[0].length; q++) {
                if (tiles[r][q] > 0) {
                    Viewport.ctx.drawImage(Sprite.tiles[tiles[r][q]].img, q * TILE_SIZE + offset.u, r * TILE_SIZE + offset.v);
                }
            }
        }
    }

    tileIsPassable(q, r) {
        if (r < 0 || r >= this.tiles.length) return true;
        if (q < 0 || q >= this.tiles[0].length) return true;
        return this.tiles[r][q] < 1;
    }

    landedOnTile(tile) {
        console.log('LAND on tile');

        for (let entity of this.entities) {
            if (entity.landedOnTile) entity.landedOnTile(tile);
        }

        this.entities.push(new LandingParticle(this.pos));
        this.entities.push(new LandingParticle(this.pos));
        this.entities.push(new LandingParticle(this.pos));
        this.entities.push(new LandingParticle(this.pos));
        this.entities.push(new LandingParticle(this.pos));
        this.entities.push(new LandingParticle(this.pos));
    }

    rescueLittlePig() {
        this.littlePigsRescued++;
    }
}
