import { ManAni } from '@src/ports/GR/GR.types';
import { Point2D } from './LevelMap';

export enum Ani {
    RUNNING = 'RUNNING',
    STOPPED = 'STOPPED'
}
export class Man {
    manFieldXY: Point2D;
    nextManFieldXY: Point2D;
    miniCounter: number;
    manAni: ManAni;

    onStart = () => {
        this.miniCounter = 0;
        this.manFieldXY = { x: 8, y: 0 };
        this.nextManFieldXY = { ...this.manFieldXY };
        this.manAni = ManAni.STAND;
    };

    stepRight = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x + 1, y: this.manFieldXY.y };
        this.manAni = ManAni.RIGHT;
    };

    stepLeft = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x - 1, y: this.manFieldXY.y };
        this.manAni = ManAni.LEFT;
    };

    stepDown = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x, y: this.manFieldXY.y + 1 };
        this.manAni = ManAni.STAIRS;
    };

    stepUp = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x, y: this.manFieldXY.y - 1 };
        this.manAni = ManAni.STAIRS;
    };

    tick = (): Ani => {
        if ((this.miniCounter + 1) % 10 === 0) {
            this.manFieldXY = { ...this.nextManFieldXY };
            this.manAni = ManAni.STAND;
            return Ani.STOPPED;
        } else {
            const miniCounter = this.miniCounter + 1;
            this.miniCounter = miniCounter;
            return Ani.RUNNING;
        }
    };
}
