import React from 'react';
import { render } from 'react-dom';
import { UI } from './components/UI';
import ImgSprite from '@src/components/UI/sprite.png';
import { level1 } from './ports/levels/level1';
import { LevelMap, Point2D, defaultPoint2D } from './game/LevelMap';
import { GRMap } from './ports/GR/GRMap';
import { GRMan } from './ports/GR/GRMan';
import { ManAni, SPRITE_HEIGHT, SPRITE_WIDTH } from './ports/GR/GR.types';

console.log('main!');

const MAX_MINI_COUNTER = 9;

class GameController {
    picLoaded: boolean;
    levelMap: LevelMap = null;
    pic: InstanceType<typeof Image> = new Image();
    miniCounter: number;
    manFieldXY: Point2D;
    nextManFieldXY: Point2D;
    manAni: ManAni;

    run() {
        this.levelMap = LevelMap.create().initFromText(level1);

        render(<UI />, document.getElementById('game'));
        this.miniCounter = 0;
        this.manFieldXY = { x: 8, y: 0 };
        this.nextManFieldXY = { ...this.manFieldXY };
        this.manAni = ManAni.STAND;

        this.loadPic().then(() => {
            this.picLoaded = true;

            this.renderScene();
        });

        document.getElementById('btRight').addEventListener('click', () => {
            this.stepRight();
        });
        document.getElementById('btLeft').addEventListener('click', () => {
            this.stepLeft();
        });
        document.getElementById('btDown').addEventListener('click', () => {
            this.stepDown();
        });
        document.getElementById('btUp').addEventListener('click', () => {
            this.stepUp();
        });
    }
    loadPic = () => {
        return new Promise((resolve) => {
            this.pic.src = ImgSprite;
            this.pic.onload = function () {
                resolve(true);
            };
        });
    };

    renderScene(): CanvasRenderingContext2D {
        if (!this.picLoaded) {
            console.log('!picLoaded');
            return null;
        }

        const canvas = document.getElementById('canvas') as HTMLCanvasElement;

        if (canvas === null) {
            console.log('canvas === null');
            return null;
        }
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.fillStyle = 'orange';
        context.strokeStyle = '#FF0000';
        context.lineWidth = 3;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        if (canvas === null || context === null) {
            console.log('graph === null');
            return;
        }

        GRMap.create(context, this.levelMap, this.pic).draw();
        let manTargetScreenXY: Point2D = { ...defaultPoint2D };

        GRMan.create(
            context,
            calcManScreenPos(this.manFieldXY, this.nextManFieldXY, this.miniCounter),
            manTargetScreenXY,
            this.manAni,
            this.pic,
            this.miniCounter
        ).draw();
        return context;
    }

    stepRight = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x + 1, y: this.manFieldXY.y };
        this.manAni = ManAni.RIGHT;
        this.tick();
    };

    stepLeft = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x - 1, y: this.manFieldXY.y };
        this.manAni = ManAni.LEFT;
        this.tick();
    };

    stepDown = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x, y: this.manFieldXY.y + 1 };
        this.manAni = ManAni.STAIRS;
        this.tick();
    };

    stepUp = () => {
        this.miniCounter = 0;
        this.nextManFieldXY = { x: this.manFieldXY.x, y: this.manFieldXY.y - 1 };
        this.manAni = ManAni.STAIRS;
        this.tick();
    };

    tick = () => {
        if ((this.miniCounter + 1) % 10 === 0) {
            this.manFieldXY = { ...this.nextManFieldXY };
            this.manAni = ManAni.STAND;
            this.renderScene();
        } else {
            const miniCounter = this.miniCounter + 1;
            this.miniCounter = miniCounter;
            this.renderScene();
            setTimeout(() => this.tick(), 100);
        }
    };
}

const c = new GameController();
c.run();

function calcManScreenPos(manFieldXY: Point2D, nextManFieldXY: Point2D, miniCounter: number) {
    const deltaX = nextManFieldXY.x - manFieldXY.x;
    const deltaY = nextManFieldXY.y - manFieldXY.y;
    const manScreenXY = {
        x: (manFieldXY.x + (deltaX / 10) * (miniCounter % 10)) * SPRITE_WIDTH,
        y: (manFieldXY.y + (deltaY / 10) * (miniCounter % 10)) * SPRITE_HEIGHT
    };
    return manScreenXY;
}
