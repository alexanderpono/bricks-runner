import { Sprite, space, stairs, wall } from '@src/ports/GR/GR.types';
import { putSprite } from '@src/ports/GR/GR.lib';

import { Cell, LevelMap } from '@src/game/LevelMap';

export class GRMap {
    constructor(
        private context: CanvasRenderingContext2D,
        private level: LevelMap,
        private pic: CanvasImageSource
    ) {}

    draw = () => {
        this.level.field.forEach((line: Cell[], y: number) => {
            line.forEach((cell: Cell, x: number) => {
                let sprite: Sprite = space;
                if (cell === Cell.wall) {
                    sprite = wall;
                }
                if (cell === Cell.stairs) {
                    sprite = stairs;
                }
                putSprite(this.context, this.pic, sprite, x, y);
            });
        });
    };

    static create = (
        context: CanvasRenderingContext2D,
        level: LevelMap,
        pic: CanvasImageSource
    ): GRMap => new GRMap(context, level, pic);
}